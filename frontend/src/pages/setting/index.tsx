import React, { useEffect, useState } from 'react'
import { Environment } from 'wailsjs/runtime'
import { envType } from '@/types/env'
import {
  SETTING_CONFIG_ENUM,
  settingConfigType,
  USER_CONFIG_ENUM,
} from '@/types/config'
import {
  Box,
  Button,
  Card,
  Flex,
  SegmentedControl,
  Separator,
  Switch,
  Tooltip,
} from '@radix-ui/themes'
import {
  ChevronRightIcon,
  ExitIcon,
  QuestionMarkCircledIcon,
  SymbolIcon,
} from '@radix-ui/react-icons'
import {
  APP_NAME,
  APP_VERSION,
  DialogType,
  ReadConfig,
  ShowMessageDialog,
  Storage,
  UpdateConfig,
  GetSystemTheme,
  WindowSetLightTheme,
  WindowSetDarkTheme,
  OpenLogDir,
  toast,
} from '@/utils'
import { getUserPreference, updateUserPreference } from '@/api/user'
import { useNavigateTo, usePlayer } from '@/hooks'
import APP_ICON from '@/assets/images/logo.png'
import {
  USER_PREFERENCE_ENUM,
  userPreferenceType,
  userType,
} from '@/types/user'
import { BlockedModal } from './components/blockedModal'
import { ProxyModal } from './components/proxyModal'
import { UpgradeModal } from './components/upgradeModal'
import { NewVersionModal } from './components/newVersionModal'
import styles from './index.module.scss'
import { CONSTANT } from '@/types/constant'
import { CheckForUpgrade } from 'wailsjs/go/bridge/App'
import dayjs from 'dayjs'
import { ThemeMode, useTheme } from '@/layouts/theme'
import { BsFolder } from 'react-icons/bs'

export const Setting: React.FC = () => {
  const [envInfo, setEnvInfo] = useState<envType>()
  const [config, setConfig] = useState<settingConfigType>({
    checkUpdateOnStartup: false,
    theme: 'light',
  })
  const [preferenceLists, setPreferenceLists] = useState<userPreferenceType>({
    isRecentPlayedHidden: false,
    isListenMileageHiddenInComment: false,
    isStickerLibraryHidden: false,
    isStickerBoardHidden: false,
    rejectHotPush: false,
    rejectRecommendation: false,
  })
  const userInfo: userType = Storage.get('user_info')
  const [blockedModal, setBlockedModal] = useState<boolean>(false)
  const [upgradeModal, setUpgradeModal] = useState<boolean>(false)
  const [proxyModal, setProxyModal] = useState<boolean>(false)
  const [checkLoading, setCheckLoading] = useState<boolean>(false)
  const [openLogDirLoading, setOpenLogDirLoading] = useState<boolean>(false)
  const [newVersionModalInfo, setNewVersionModalInfo] = useState<{
    open: boolean
    createdAt: string
    tagName: string
    body: string
  }>({
    open: false,
    createdAt: '',
    tagName: '',
    body: '',
  })
  const player = usePlayer()

  const goAbout = useNavigateTo('/about')
  const goLogin = useNavigateTo('/login')

  const { toggle } = useTheme()

  const checkUpdate = () => {
    setCheckLoading(true)

    CheckForUpgrade()
      .then((res) => {
        if (res.err !== '') {
          ShowMessageDialog(DialogType.ERROR, '提示', res.err).then()

          return
        }

        if (!res.isLatest) {
          setNewVersionModalInfo({
            open: true,
            createdAt: dayjs(res.latest?.created_at).format('YYYY-MM-DD'),
            tagName: res.latest?.tag_name || '',
            body: res.latest?.body || '',
          })
        } else {
          ShowMessageDialog(DialogType.INFO, '提示', '当前已是最新版本').then()
        }
      })
      .finally(() => {
        setCheckLoading(false)
      })
  }

  /**
   * 退出登录
   */
  const logout = () => {
    ShowMessageDialog(DialogType.QUESTION, '提示', '确定要退出登录吗？').then(
      async (res) => {
        if (res === 'Yes' || res === '是') {
          try {
            await Promise.all([
              UpdateConfig(USER_CONFIG_ENUM.accessToken, '').then(),
              UpdateConfig(USER_CONFIG_ENUM.refreshToken, '').then(),
            ])

            Storage.clear()
            player.stop()
            goLogin()
          } catch (err) {
            console.error(err)
          }
        }
      },
    )
  }

  /**
   * 获取用户偏好设置
   */
  const onGetUserPreference = () => {
    getUserPreference()
      .then((res) => setPreferenceLists({ ...res.data.data }))
      .catch((err) => {
        console.error(err)
      })
  }

  /**
   * 更新用户偏好设置
   * @param type 类型
   * @param flag 状态
   */
  const onUpdateUserPreference = (type: string, flag: boolean) => {
    const params = {
      type,
      flag,
    }

    updateUserPreference(params)
      .then((res) => setPreferenceLists({ ...res.data.data }))
      .catch((err) => {
        console.log(err)
      })
  }

  const onUpdateConfig = (key: string, value: any) => {
    UpdateConfig(key, value).then()
  }

  const onThemeChange = (value: 'light' | 'dark' | 'system') => {
    if (value !== 'system') {
      toggle(value)

      if (value === 'light') {
        WindowSetLightTheme()
      }

      if (value === 'dark') {
        WindowSetDarkTheme()
      }
    } else {
      GetSystemTheme().then((theme) => {
        toggle(theme as ThemeMode)

        if (theme === 'light') {
          WindowSetLightTheme()
        }

        if (theme === 'dark') {
          WindowSetDarkTheme()
        }
      })
    }

    UpdateConfig(SETTING_CONFIG_ENUM.theme, value).catch((err) => {
      console.error(err)
    })

    setConfig({
      ...config,
      theme: value,
    })
  }

  useEffect(() => {
    Environment().then((res: envType) => {
      setEnvInfo(res)
    })

    onGetUserPreference()

    ReadConfig(SETTING_CONFIG_ENUM.theme).then((theme) => {
      setConfig((prevState) => ({ ...prevState, theme: theme || 'light' }))
    })

    ReadConfig(SETTING_CONFIG_ENUM.checkUpdateOnStartup).then((config) => {
      setConfig((prevState) => ({ ...prevState, checkUpdateOnStartup: config }))
    })
  }, [])

  return (
    <div className={styles['setting-layout']}>
      <h4>账号绑定</h4>
      <Card>
        <Flex>
          <Box width="70%">手机号</Box>
          <Box className={styles['content_text']}>
            {userInfo.mobilePhoneNumber}
          </Box>
        </Flex>
        {userInfo.wechatUserInfo?.nickName && (
          <>
            <Separator
              my="3"
              size="4"
            />
            <Flex>
              <Box width="70%">微信</Box>
              <Box className={styles['content_text']}>
                {userInfo.wechatUserInfo?.nickName}
              </Box>
            </Flex>
          </>
        )}

        {userInfo.jikeUserInfo?.nickname && (
          <>
            <Separator
              my="3"
              size="4"
            />
            <Flex>
              <Box width="70%">即刻</Box>
              <Box className={styles['content_text']}>
                {userInfo.jikeUserInfo?.nickname}
              </Box>
            </Flex>
          </>
        )}
      </Card>

      <h4>隐私设置</h4>
      <Card>
        <Flex>
          <Box width="100%">{CONSTANT.RECENT_PLAYED_HIDDEN}</Box>
          <Box>
            <Switch
              checked={preferenceLists.isRecentPlayedHidden}
              onCheckedChange={(checked) => {
                onUpdateUserPreference(
                  USER_PREFERENCE_ENUM.isRecentPlayedHidden,
                  checked,
                )
              }}
            />
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex>
          <Box width="100%">{CONSTANT.LISTEN_MILEAGE_HIDDEN_IN_COMMENT}</Box>
          <Box>
            <Switch
              checked={preferenceLists.isListenMileageHiddenInComment}
              onCheckedChange={(checked) => {
                onUpdateUserPreference(
                  USER_PREFERENCE_ENUM.isListenMileageHiddenInComment,
                  checked,
                )
              }}
            />
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex>
          <Box width="100%">{CONSTANT.STICKER_LIBRARY_HIDDEN}</Box>
          <Box>
            <Switch
              checked={preferenceLists.isStickerLibraryHidden}
              onCheckedChange={(checked) => {
                onUpdateUserPreference(
                  USER_PREFERENCE_ENUM.isStickerLibraryHidden,
                  checked,
                )
              }}
            />
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex>
          <Box width="100%">{CONSTANT.STICKER_BOARD_HIDDEN}</Box>
          <Box>
            <Switch
              checked={preferenceLists.isStickerBoardHidden}
              onCheckedChange={(checked) => {
                onUpdateUserPreference(
                  USER_PREFERENCE_ENUM.isStickerBoardHidden,
                  checked,
                )
              }}
            />
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex>
          <Box width="100%">{CONSTANT.REJECT_HOT_PUSH}</Box>
          <Box>
            <Switch
              checked={preferenceLists.rejectHotPush}
              onCheckedChange={(checked) => {
                onUpdateUserPreference(
                  USER_PREFERENCE_ENUM.rejectHotPush,
                  checked,
                )
              }}
            />
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex>
          <Box width="100%">{CONSTANT.REJECT_RECOMMEND_ACTION}</Box>
          <Box>
            <Switch
              checked={preferenceLists.rejectRecommendation}
              onCheckedChange={(checked) => {
                onUpdateUserPreference(
                  USER_PREFERENCE_ENUM.rejectRecommendation,
                  checked,
                )
              }}
            />
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setBlockedModal(true)
          }}
        >
          <Box width="100%">
            小黑屋
            <Tooltip content="已拉黑的用户">
              <QuestionMarkCircledIcon
                style={{
                  marginLeft: '6px',
                  cursor: 'help',
                }}
              />
            </Tooltip>
          </Box>
          <Box>
            <ChevronRightIcon />
          </Box>
        </Flex>
      </Card>

      <h4>其他</h4>
      <Card>
        <Flex>
          <Box width="100%">主题</Box>
          <Box>
            <SegmentedControl.Root
              value={config.theme}
              size={'1'}
              onValueChange={onThemeChange}
            >
              <SegmentedControl.Item value="system">
                跟随系统
              </SegmentedControl.Item>
              <SegmentedControl.Item value="light">明亮</SegmentedControl.Item>
              <SegmentedControl.Item value="dark">暗黑</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex>
          <Box width="100%">软件更新</Box>
          <Box>
            <Button
              size={'1'}
              variant={'soft'}
              style={{ width: '100px' }}
              onClick={checkUpdate}
              loading={checkLoading}
            >
              <SymbolIcon />
              检查更新...
            </Button>
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex>
          <Box width="100%">启动时检查更新</Box>
          <Box>
            <Switch
              checked={config?.checkUpdateOnStartup}
              onCheckedChange={(checked: boolean) => {
                setConfig({
                  ...config,
                  checkUpdateOnStartup: checked,
                })
                onUpdateConfig(
                  SETTING_CONFIG_ENUM.checkUpdateOnStartup,
                  checked,
                )
              }}
            />
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex>
          <Box width="100%">日志</Box>
          <Box>
            <Button
              size={'1'}
              variant={'soft'}
              style={{ width: '130px' }}
              onClick={() => {
                setOpenLogDirLoading(true)

                OpenLogDir()
                  .then((r: any) => {
                    if (r) {
                      toast(r, {
                        type: 'warn',
                      })

                      console.err(r)
                    }
                  })
                  .finally(() => {
                    setOpenLogDirLoading(false)
                  })
              }}
              loading={openLogDirLoading}
            >
              <BsFolder />
              打开应用日志目录
            </Button>
          </Box>
        </Flex>
        <Separator
          my="3"
          size="4"
        />
        <Flex
          style={{ cursor: 'pointer' }}
          onClick={goAbout}
        >
          <Box width="100%">关于</Box>
          <Box>
            <ChevronRightIcon />
          </Box>
        </Flex>
      </Card>

      <h4>代理</h4>
      <Card>
        <Flex
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setProxyModal(true)
          }}
        >
          <Box width="100%">
            HTTP 代理
            <Tooltip content="连接 Github 时启用 HTTP 代理">
              <QuestionMarkCircledIcon
                style={{
                  marginLeft: '6px',
                  cursor: 'help',
                }}
              />
            </Tooltip>
          </Box>
          <Box>
            <ChevronRightIcon />
          </Box>
        </Flex>
      </Card>

      <h4>账户</h4>
      <Card>
        <Flex>
          <Box width="100%">登出</Box>
          <Box>
            <Button
              size={'1'}
              variant="soft"
              style={{ width: '100px' }}
              onClick={() => {
                logout()
              }}
              color="red"
            >
              <ExitIcon /> 退出登录
            </Button>
          </Box>
        </Flex>
      </Card>

      <div className={styles['app-logo']}>
        <div className={styles['logo']}>
          <img
            src={APP_ICON}
            alt="app_icon"
          />
        </div>
      </div>

      <div className={styles['app-info']}>
        <div>{APP_NAME}</div>
        <p>
          v{APP_VERSION}_{envInfo?.platform}_{envInfo?.arch}
        </p>
      </div>

      <BlockedModal
        open={blockedModal}
        onClose={() => {
          setBlockedModal(false)
        }}
      />

      <ProxyModal
        open={proxyModal}
        onClose={() => {
          setProxyModal(false)
        }}
      />

      <NewVersionModal
        open={newVersionModalInfo.open}
        newVersionInfo={{
          createdAt: newVersionModalInfo.createdAt,
          tagName: newVersionModalInfo.tagName,
          body: newVersionModalInfo.body,
        }}
        onOk={() => {
          setNewVersionModalInfo({
            open: false,
            createdAt: '',
            tagName: '',
            body: '',
          })
          setUpgradeModal(true)
        }}
        onClose={() => {
          setNewVersionModalInfo({
            open: false,
            createdAt: '',
            tagName: '',
            body: '',
          })
        }}
      />

      <UpgradeModal
        open={upgradeModal}
        onClose={() => setUpgradeModal(false)}
      />
    </div>
  )
}
