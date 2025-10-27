import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { PlayController, TitleBar } from '@/components'
import { useNavigateTo } from '@/hooks'
import { ReadConfig, Storage, toast } from '@/utils'
import { Launch } from '@/pages'
import styles from './index.module.scss'
import { CheckForUpgrade } from 'wailsjs/go/bridge/App'
import { UpgradeModal } from '@/pages/setting/components/upgradeModal'
import { Profile } from '@/api/profile'
import { userType } from '@/types/user'
import { SETTING_CONFIG_ENUM, USER_CONFIG_ENUM } from '@/types/config'

export const Root: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [checkUpgrade, setCheckUpgrade] = useState<boolean>(false)
  const [upgradeModal, setUpgradeModal] = useState<boolean>(false)
  const location = useLocation()

  const goLogin = useNavigateTo('/login')
  const goHome = useNavigateTo('/')

  const updateProfile = async () => {
    await Profile()
      .then((res) => {
        const data: userType = {
          uid: res.data.data.uid,
          bio: res.data.data.bio,
          avatar: res.data.data.avatar.picture.picUrl,
          nickname: res.data.data.nickname,
          gender: res.data.data.gender,
          industry: res.data.data.industry,
          mobilePhoneNumber: res.data.data.phoneNumber.mobilePhoneNumber,
          ipLoc: res.data.data.ipLoc,
          wechatUserInfo: res.data.data?.wechatUserInfo,
          jikeUserInfo: res.data.data?.jikeUserInfo,
        }

        Storage.set('user_info', data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const onReadConfigFunc = () => {
    ReadConfig(USER_CONFIG_ENUM.accessToken)
      .then(async (config) => {
        if (config) {
          updateProfile()
            .then(() => {
              goHome()
            })
            .catch(() => {
              goLogin()
            })
        }
      })
      .catch((err: any) => {
        console.error('error', err)
      })
      .finally(() => {
        setLoading(false)
      })

    ReadConfig(SETTING_CONFIG_ENUM.checkUpdateOnStartup)
      .then(async (config) => {
        setCheckUpgrade(config)
      })
      .catch((err: any) => {
        console.error('error', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onCheckForUpgrade = () => {
    CheckForUpgrade()
      .then((res) => {
        if (!res.isLatest && !res.err) {
          toast('发现新版本！', {
            type: 'info',
            duration: 15 * 1000,
          })
        }
      })
      .catch((err: any) => {
        console.error('error', err)
        toast(err, {
          type: 'warn',
        })
      })
  }

  useEffect(() => {
    onReadConfigFunc()
  }, [])

  useEffect(() => {
    if (checkUpgrade) {
      onCheckForUpgrade()
    }
  }, [checkUpgrade])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location])

  return (
    <>
      {loading ? (
        <Launch />
      ) : (
        <>
          <TitleBar />

          <div
            className={styles['outlet-layout']}
            ref={scrollRef}
          >
            <Outlet />
          </div>

          <PlayController />
        </>
      )}

      <UpgradeModal
        open={upgradeModal}
        onClose={() => setUpgradeModal(false)}
      />
    </>
  )
}
