import React, { useEffect, useRef, useState } from 'react'
import { useNavigateTo } from '@/hooks'
import {
  Button,
  Container,
  Section,
  TextField,
  Text,
  Tooltip,
  Flex,
  Box,
  Spinner,
} from '@radix-ui/themes'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { QRCodeSVG } from 'qrcode.react'
import APP_ICON from '@/assets/images/logo.png'
import { USER_CONFIG_ENUM } from '@/types/config'
import { sendCode, login, qrcodeCreate, qrcodeLogin } from '@/api/login'
import { Profile } from '@/api/profile'
import { isValidPhoneNumber, UpdateConfig, toast, Storage } from '@/utils'
import UserStore from '@/store/user'
import { userType } from '@/types/user'
import '@/assets/global/animate.css'
import styles from './index.module.scss'
import { CONSTANT } from '@/types/constant'

export const Login: React.FC = () => {
  const [animate, setAnimate] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [smsLoading, setSmsLoading] = React.useState<boolean>(false)
  const [timer, setTimer] = useState<number>(0)
  const [isCounting, setIsCounting] = useState<boolean>(false)
  const [mobilePhoneNumber, setMobilePhoneNumber] = useState<string>('')
  const [verifyCode, setVerifyCode] = useState<string>('')

  const goHome = useNavigateTo('/')

  /** 登录方式：手机验证码 / 扫码 */
  const [loginMode, setLoginMode] = useState<'sms' | 'qrcode'>('sms')
  const [qrcodeUrl, setQrcodeUrl] = useState<string>('')
  const [qrcodeId, setQrcodeId] = useState<string>('')
  const [qrcodeStatus, setQrcodeStatus] = useState<string>('')
  const confirmedRef = useRef<boolean>(false)

  /**
   * 切到扫码登录：创建一张二维码
   */
  const onCreateQrcode = () => {
    setLoginMode('qrcode')
    setQrcodeUrl('')
    setQrcodeId('')
    setQrcodeStatus('')
    confirmedRef.current = false

    qrcodeCreate()
      .then((res) => {
        setQrcodeUrl(res.data.url)
        setQrcodeId(res.data.id)
        setQrcodeStatus('WAITTING')
      })
      .catch((err) => {
        console.error(err)
        toast('获取二维码失败', { type: 'warn' })
      })
  }

  /**
   * 扫码确认后：写入凭证、拉取用户信息、进入首页
   */
  const onQrcodeConfirmed = async (accessToken: string, refreshToken: string) => {
    await UpdateConfig(USER_CONFIG_ENUM.accessToken, accessToken)
    await UpdateConfig(USER_CONFIG_ENUM.refreshToken, refreshToken)

    try {
      const res = await Profile()
      const data: userType = {
        uid: res.data.data.uid,
        bio: res.data.data.bio,
        avatar: res.data.data.avatar.picture.picUrl,
        nickname: res.data.data.nickname,
        gender: res.data.data.gender,
        industry: res.data.data.industry,
        mobilePhoneNumber: res.data.data.phoneNumber?.mobilePhoneNumber,
        ipLoc: res.data.data.ipLoc,
        wechatUserInfo: res.data.data?.wechatUserInfo,
        jikeUserInfo: res.data.data?.jikeUserInfo,
      }

      UserStore.init(data)
      Storage.set('user_info', data)
      toast(`欢迎，${data.nickname}`, { type: 'success' })
    } catch (err) {
      console.error(err)
    }

    goHome()
  }

  /** 轮询扫码状态（1s 一次） */
  useEffect(() => {
    if (loginMode !== 'qrcode' || !qrcodeId) return

    const timer = setInterval(() => {
      if (confirmedRef.current) return

      qrcodeLogin(qrcodeId)
        .then((res) => {
          const status = res.data?.status
          // 扫码确认后 token 会出现在响应头里（此时 status 为 USED），以它作为成功标志
          const accessToken = res.headers['x-jike-access-token']
          const refreshToken = res.headers['x-jike-refresh-token']

          setQrcodeStatus(status)

          if (accessToken && refreshToken) {
            confirmedRef.current = true
            clearInterval(timer)
            onQrcodeConfirmed(accessToken, refreshToken).then()
          }
        })
        .catch((err) => {
          console.error(err)

          // 二维码已失效时停止轮询，避免反复重试
          const code = err?.response?.status

          if (code === 400 || code === 401) {
            confirmedRef.current = true
            clearInterval(timer)
            setQrcodeStatus('EXPIRED')
          }
        })
    }, 1000)

    return () => clearInterval(timer)
  }, [loginMode, qrcodeId])

  const onStartCountdown = (): void => {
    if (!isCounting) {
      setTimer(60)
      setIsCounting(true)
    }
  }

  /**
   * 登录
   */
  const onLogin = () => {
    setLoading(true)

    const params = {
      mobilePhoneNumber,
      verifyCode,
    }

    login(params)
      .then((res) => {
        toast(`欢迎，${res.data.data.nickname}`, { type: 'success' })
        UpdateConfig(
          USER_CONFIG_ENUM.accessToken,
          res.data['x-jike-access-token'],
        ).then()
        UpdateConfig(
          USER_CONFIG_ENUM.refreshToken,
          res.data['x-jike-refresh-token'],
        ).then()

        const data: userType = {
          uid: res.data.data.uid,
          bio: res.data.data?.bio,
          avatar: res.data.data.avatar.picture.picUrl,
          nickname: res.data.data.nickname,
          mobilePhoneNumber: res.data.data.phoneNumber.mobilePhoneNumber,
          ipLoc: res.data.data.ipLoc,
          gender: res.data.data?.gender,
          industry: res.data.data?.industry,
          wechatUserInfo: res.data.data?.wechatUserInfo,
          jikeUserInfo: res.data.data?.jikeUserInfo,
        }

        UserStore.init(data)

        Storage.set('user_info', data)

        goHome()
      })
      .catch((err) => {
        toast(CONSTANT.LOGIN_FAILED, { duration: 3000, type: 'warn' })
        console.error('error', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  /**
   * 发送短信验证码
   */
  const onSendCode = () => {
    if (
      mobilePhoneNumber.length === 11 &&
      isValidPhoneNumber(mobilePhoneNumber)
    ) {
      setSmsLoading(true)

      sendCode({ mobilePhoneNumber })
        .then(() => {
          onStartCountdown()
          toast(`验证码已发送至 ${mobilePhoneNumber}`, { type: 'success' })
        })
        .catch(() => {
          toast('发送验证码失败', { type: 'warn' })
        })
        .finally(() => {
          setSmsLoading(false)
        })
    } else {
      setAnimate(true)
      setTimeout(() => {
        setAnimate(false)
      }, 500)
    }
  }

  useEffect(() => {
    let interval: any
    if (isCounting && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else if (timer === 0) {
      setIsCounting(false)
    }
    return () => clearInterval(interval)
  }, [isCounting, timer])

  return (
    <>
      <Container
        size="1"
        className={styles['login-wrapper']}
        style={
          {
            '--wails-draggable': 'drag',
          } as any
        }
      >
        <Section size="3">
          <div className={styles['logo-layout']}>
            <div className={styles['logo']}>
              <img
                src={APP_ICON}
                alt="APP_ICON"
              />
            </div>
          </div>

          <div className={styles['form-layout']}>
            {loginMode === 'sms' && (
              <div className={styles['form']}>
                <Text style={{ display: 'flex', alignItems: 'center' }}>
                  手机验证登录
                  <Tooltip content={CONSTANT.LOGIN_TOOLTIP}>
                    <QuestionMarkCircledIcon style={{ marginLeft: 4 }} />
                  </Tooltip>
                </Text>

                <TextField.Root
                  autoComplete="off"
                  name={`input-${Math.random()}`}
                  className={animate ? 'shakeX' : ''}
                  id="phone"
                  placeholder="请输入"
                  size="3"
                  style={{ marginTop: 12, marginBottom: 12 }}
                  maxLength={11}
                  value={mobilePhoneNumber}
                  onChange={(e) => {
                    setMobilePhoneNumber(e.target.value)
                  }}
                >
                  <TextField.Slot>+86</TextField.Slot>
                </TextField.Root>

                <Flex gap="3">
                  <Box width="60%">
                    <TextField.Root
                      placeholder="短信验证码"
                      size="3"
                      style={{ marginBottom: 12 }}
                      maxLength={4}
                      value={verifyCode}
                      onChange={(e) => {
                        setVerifyCode(e.target.value)
                      }}
                    />
                  </Box>

                  <Box width="40%">
                    <Button
                      size="3"
                      style={{ width: '100%' }}
                      variant="outline"
                      onClick={onSendCode}
                      disabled={isCounting}
                      loading={smsLoading}
                    >
                      {isCounting ? `${timer}s` : '发送验证码'}
                    </Button>
                  </Box>
                </Flex>

                <Button
                  size="3"
                  style={{ width: '100%' }}
                  loading={loading}
                  onClick={() => {
                    onLogin()
                  }}
                  disabled={mobilePhoneNumber == '' || verifyCode == ''}
                >
                  登录
                </Button>

                <Button
                  size="3"
                  variant="soft"
                  color="gray"
                  style={{ width: '100%', marginTop: 12 }}
                  onClick={onCreateQrcode}
                >
                  扫码登录
                </Button>
              </div>
            )}

            {loginMode === 'qrcode' && (
              <div className={styles['form']}>
                <Text style={{ display: 'flex', alignItems: 'center' }}>
                  扫码登录
                </Text>

                <Flex
                  align="center"
                  justify="center"
                  style={{ height: 180, marginTop: 12, marginBottom: 12 }}
                >
                  {qrcodeUrl ? (
                    <QRCodeSVG
                      value={qrcodeUrl}
                      size={180}
                    />
                  ) : (
                    <Spinner size="3" />
                  )}
                </Flex>

                <Text
                  as="p"
                  size="2"
                  align="center"
                  style={{ marginBottom: 12 }}
                >
                  {qrcodeStatus === 'WAITTING'
                    ? '请用小宇宙 App 扫码'
                    : qrcodeStatus === 'SCANNED'
                      ? '已扫码，请在手机上确认'
                      : qrcodeStatus === 'USED' ||
                          qrcodeStatus === 'CONFIRMED'
                        ? '登录成功，正在进入…'
                        : qrcodeStatus === 'EXPIRED'
                          ? '二维码已失效，请重新获取'
                          : '正在获取二维码…'}
                </Text>

                <Button
                  size="3"
                  variant="soft"
                  color="gray"
                  style={{ width: '100%' }}
                  onClick={() => {
                    setLoginMode('sms')
                  }}
                >
                  返回手机登录
                </Button>
              </div>
            )}
          </div>
        </Section>
      </Container>
    </>
  )
}
