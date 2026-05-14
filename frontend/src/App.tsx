import { RouterProvider } from 'react-router-dom'
import { router } from './router/routes'
import { useEffect, useState } from 'react'
import { SaveLastPlay } from '@/utils'
import { usePlayer } from '@/hooks'
import {
  StickerModal,
  ProfileModal,
  SubscriptionModal,
  PodcastDetailModal,
} from '@/components'
import { EventsOn } from '../wailsjs/runtime'
import {
  showProfileModalType,
  showStickerModalType,
  showSubscriptionModalType,
  showPodcastDetailModalType,
} from '@/types/dialog'
import { perspectiveType } from '@/types/user'

function App() {
  const player = usePlayer()
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

  useEffect(() => {
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
    SaveLastPlay(player)
  }, [player])

  return (
    <>
      <RouterProvider router={router} />

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

export default App
