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
          uid: res.data.uid,
          bio: res.data.bio,
          avatar: res.data.avatar.picture.picUrl,
          nickname: res.data.nickname,
          gender: res.data.gender,
          industry: res.data.industry,
          mobilePhoneNumber: res.data.phoneNumber.mobilePhoneNumber,
          ipLoc: res.data.ipLoc,
          wechatUserInfo: res.data?.wechatUserInfo,
          jikeUserInfo: res.data?.jikeUserInfo,
        }

        Storage.set('user_info', data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const onReadConfigFunc = () => {
    ReadConfig()
      .then(async (res) => {
        if (res.setting.checkUpdateOnStartup) {
          setCheckUpgrade(true)
        }

        if (res?.user?.accessToken) {
          await updateProfile()

          return goHome()
        } else {
          return goLogin()
        }
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
        if (!res.isLatest) {
          toast('发现新版本！', {
            type: 'info',
            duration: 15 * 1000,
          })
        }
      })
      .catch((err: any) => {
        console.error('error', err)
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
