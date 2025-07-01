import React, { useEffect, useRef, useState } from 'react'
import {
  MagnifyingGlassIcon,
  GlobeIcon,
  CardStackIcon,
  StarIcon,
  GearIcon,
} from '@radix-ui/react-icons'
import { ScrollArea } from '@radix-ui/themes'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { PlayController, NavUser } from '@/components'
import { useNavigateTo } from '@/hooks'
import {
  ReadConfig,
  ShowMessageDialog,
  DialogType,
  APP_VERSION,
  Storage,
} from '@/utils'
import { Launch } from '@/pages'
import styles from './index.module.scss'
import { CheckForUpgrade } from 'wailsjs/go/bridge/App'
import dayjs from 'dayjs'
import { UpgradeModal } from '@/pages/setting/components/upgradeModal'
import { Profile } from '@/api/profile'
import { userType } from '@/types/user'

export const Root: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [checkUpgrade, setcheckUpgrade] = useState<boolean>(false)
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
          setcheckUpgrade(true)
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
        if (res.err !== '') {
          ShowMessageDialog(DialogType.ERROR, '提示', res.err).then()

          return
        }

        if (!res.isLatest) {
          ShowMessageDialog(
            DialogType.QUESTION,
            '发现新版本！',
            `发布时间：${dayjs(res.latest?.created_at).format('YYYY-MM-DD')}\r\n当前版本：v${APP_VERSION}\r\n最新版本：${res.latest?.tag_name}\r\n更新内容：\r\n${res.latest?.body}\r\n\r\n是否升级？`,
          ).then((res) => {
            if (res === 'Yes' || res === '是') {
              setUpgradeModal(true)
            }
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
  //
  // useEffect(() => {
  //   if (checkUpgrade) {
  //     onCheckForUpgrade()
  //   }
  // }, [checkUpgrade])
  //
  // useEffect(() => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollTo({ top: 0 })
  //   }
  // }, [location])

  return (
    <>
      {loading ? (
        <Launch />
      ) : (
        <>
          <div className={styles.rootLayout}>
            {/*  <nav className="nav-layout">*/}
            {/*    <NavUser />*/}

            {/*    <ul>*/}
            {/*      <li>*/}
            {/*        <NavLink*/}
            {/*          to="/"*/}
            {/*          className={({ isActive, isPending }) =>*/}
            {/*            isPending ? 'pending' : isActive ? 'active' : ''*/}
            {/*          }*/}
            {/*        >*/}
            {/*          <span className="icon-box">*/}
            {/*            <GlobeIcon className="icon" />*/}
            {/*          </span>*/}
            {/*          发现*/}
            {/*        </NavLink>*/}
            {/*      </li>*/}
            {/*      <li>*/}
            {/*        <NavLink*/}
            {/*          to="search"*/}
            {/*          className={({ isActive, isPending }) =>*/}
            {/*            isPending ? 'pending' : isActive ? 'active' : ''*/}
            {/*          }*/}
            {/*        >*/}
            {/*          <span className="icon-box">*/}
            {/*            <MagnifyingGlassIcon className="icon" />*/}
            {/*          </span>*/}
            {/*          搜索*/}
            {/*        </NavLink>*/}
            {/*      </li>*/}
            {/*      <li>*/}
            {/*        <NavLink*/}
            {/*          to="subscription"*/}
            {/*          className={({ isActive, isPending }) =>*/}
            {/*            isPending ? 'pending' : isActive ? 'active' : ''*/}
            {/*          }*/}
            {/*        >*/}
            {/*          <span className="icon-box">*/}
            {/*            <CardStackIcon className="icon" />*/}
            {/*          </span>*/}
            {/*          订阅*/}
            {/*        </NavLink>*/}
            {/*      </li>*/}
            {/*      <li>*/}
            {/*        <NavLink*/}
            {/*          to="favorites"*/}
            {/*          className={({ isActive, isPending }) =>*/}
            {/*            isPending ? 'pending' : isActive ? 'active' : ''*/}
            {/*          }*/}
            {/*        >*/}
            {/*          <span className="icon-box">*/}
            {/*            <StarIcon className="icon" />*/}
            {/*          </span>*/}
            {/*          收藏*/}
            {/*        </NavLink>*/}
            {/*      </li>*/}
            {/*      <li>*/}
            {/*        <NavLink*/}
            {/*          to="setting"*/}
            {/*          className={({ isActive, isPending }) =>*/}
            {/*            isPending ? 'pending' : isActive ? 'active' : ''*/}
            {/*          }*/}
            {/*        >*/}
            {/*          <span className="icon-box">*/}
            {/*            <GearIcon className="icon" />*/}
            {/*          </span>*/}
            {/*          设置*/}
            {/*        </NavLink>*/}
            {/*      </li>*/}
            {/*    </ul>*/}
            {/*  </nav>*/}

            {/*  <div className="outlet-layout">*/}
            {/*    <ScrollArea*/}
            {/*      type="hover"*/}
            {/*      ref={scrollRef}*/}
            {/*    >*/}
            {/*      <Outlet />*/}
            {/*    </ScrollArea>*/}
            {/*  </div>*/}
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
