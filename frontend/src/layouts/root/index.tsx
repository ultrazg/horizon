import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import {
  PlayController,
  TitleBar,
  StickerModal,
  ProfileModal,
  SubscriptionModal,
  PodcastDetailModal,
} from '@/components'
import { useNavigateTo } from '@/hooks'
import { fetchPrivateMediaUrl, ReadConfig, Storage, toast } from '@/utils'
import { Launch } from '@/pages'
import styles from './index.module.scss'
import { CheckForUpgrade } from 'wailsjs/go/bridge/App'
import { UpgradeModal } from '@/pages/setting/components/upgradeModal'
import { Profile } from '@/api/profile'
import { perspectiveType, userType } from '@/types/user'
import { PLAY_ENUM, USER_CONFIG_ENUM } from '@/types/config'
import { EventsOn } from 'wailsjs/runtime'
import {
  showPodcastDetailModalType,
  showProfileModalType,
  showStickerModalType,
  showSubscriptionModalType,
} from '@/types/dialog'
import { episodeDetail, episodePlayProgress } from '@/api/episode'
import { PlayerEpisodeInfoType } from '@/utils/player'
import { usePlayer } from '@/layouts/player'

export const Root: React.FC = () => {
  const player = usePlayer()
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [upgradeModal, setUpgradeModal] = useState<boolean>(false)
  const [hasUpdate, setHasUpdate] = useState<boolean>(false)
  const location = useLocation()
  const [stickerModalOptions, setStickerModalOptions] = useState<{
    open: boolean
    uid: string
    perspective: perspectiveType
  }>({
    open: false,
    uid: '',
    perspective: '我',
  })
  const [profileModalOptions, setProfileModalOptions] = useState<{
    open: boolean
    uid: string
  }>({
    open: false,
    uid: '',
  })
  const [subscriptionModalOptions, setSubscriptionModalOptions] = useState<{
    open: boolean
    uid: string
    perspective: perspectiveType
  }>({
    open: false,
    uid: '',
    perspective: '我',
  })
  const [podcastDetailModalOptions, setPodcastDetailModalOptions] = useState<{
    open: boolean
    pid: string
  }>({
    open: false,
    pid: '',
  })

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
        throw err
      })
  }

  const onReadConfigFunc = () => {
    ReadConfig(USER_CONFIG_ENUM.accessToken)
      .then(async (config) => {
        if (config) {
          return updateProfile()
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
  }

  const onCheckForUpgrade = () => {
    CheckForUpgrade()
      .then((res) => {
        if (!res.isLatest && !res.err) {
          setHasUpdate(true)
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

  async function getEpisodePlayProgress(eid: string) {
    let progress: number = 0
    const result = await episodePlayProgress({ eids: [eid] })
    if (result.data.data.length > 0) {
      progress = result.data.data[0].progress
    }
    return progress
  }

  async function getLastPlayEpisode() {
    const eid = await ReadConfig(PLAY_ENUM.LAST_PLAY_EID)
    if (eid !== '') {
      const res = await episodeDetail({ eid })

      const episodeInfo: PlayerEpisodeInfoType = {
        title: res.data.data.title,
        eid: res.data.data.eid,
        pid: res.data.data.podcast.pid,
        cover: res.data.data?.image
          ? res.data.data.image.picUrl
          : res.data.data.podcast.image.picUrl,
        liked: res.data.data.isFavorited,
      }
      let url: string = ''
      let progress: number = await getEpisodePlayProgress(res.data.data.eid)

      if (res.data.data.payType === 'FREE') {
        url = res.data.data.media.source.url
      } else if (
        res.data.data.payType === 'PAY_EPISODE' &&
        res.data.data.isOwned
      ) {
        url = await fetchPrivateMediaUrl(res.data.data.eid)
      } else if (
        res.data.data.payType === 'PAY_EPISODE' &&
        !res.data.data.isOwned &&
        res.data.data.trial?.segment
      ) {
        url = res.data.data.trial?.segment
      } else {
        return
      }

      player.load(url, episodeInfo, progress)
    }
  }

  useEffect(() => {
    onReadConfigFunc()

    const stickerModalFunc = EventsOn(
      'ShowStickerModal',
      (data: showStickerModalType) => {
        setStickerModalOptions({
          open: true,
          uid: data.uid,
          perspective: data.perspective,
        })
      },
    )

    const profileModalFunc = EventsOn(
      'ShowProfileModal',
      (data: showProfileModalType) => {
        setProfileModalOptions({
          open: true,
          uid: data.uid,
        })
      },
    )

    const subscriptionModalFunc = EventsOn(
      'ShowSubscriptionModal',
      (data: showSubscriptionModalType) => {
        setSubscriptionModalOptions({
          open: true,
          uid: data.uid,
          perspective: data.perspective,
        })
      },
    )

    const podcastDetailModalFunc = EventsOn(
      'ShowPodcastDetailModal',
      (data: showPodcastDetailModalType) => {
        setPodcastDetailModalOptions({
          open: true,
          pid: data.pid,
        })
      },
    )

    return () => {
      stickerModalFunc()
      profileModalFunc()
      subscriptionModalFunc()
      podcastDetailModalFunc()
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location])

  useEffect(() => {
    if (!loading) {
      getLastPlayEpisode()
      onCheckForUpgrade()
    }
  }, [loading])

  return (
    <>
      {loading ? (
        <Launch />
      ) : (
        <>
          <TitleBar hasUpdate={hasUpdate} />

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

      <StickerModal
        uid={stickerModalOptions.uid}
        perspective={stickerModalOptions.perspective}
        open={stickerModalOptions.open}
        onClose={() => {
          setStickerModalOptions({
            uid: '',
            open: false,
            perspective: '我',
          })
        }}
      />

      <ProfileModal
        uid={profileModalOptions.uid}
        open={profileModalOptions.open}
        onClose={() => {
          setProfileModalOptions({
            uid: '',
            open: false,
          })
        }}
      />

      <SubscriptionModal
        uid={subscriptionModalOptions.uid}
        perspective={subscriptionModalOptions.perspective}
        open={subscriptionModalOptions.open}
        onClose={() => {
          setSubscriptionModalOptions({
            uid: '',
            open: false,
            perspective: '我',
          })
        }}
      />

      <PodcastDetailModal
        pid={podcastDetailModalOptions.pid}
        open={podcastDetailModalOptions.open}
        onClose={() => {
          setPodcastDetailModalOptions({
            pid: '',
            open: false,
          })
        }}
      />
    </>
  )
}
