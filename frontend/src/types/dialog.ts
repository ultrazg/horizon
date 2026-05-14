import { perspectiveType } from '@/types/user'

type showStickerModalType = {
  uid: string
  perspective: perspectiveType
}

type showProfileModalType = {
  uid: string
}

type showSubscriptionModalType = {
  uid: string
  perspective: perspectiveType
}

type showPodcastDetailModalType = {
  pid: string
}

export type {
  showStickerModalType,
  showProfileModalType,
  showSubscriptionModalType,
  showPodcastDetailModalType,
}
