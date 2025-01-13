import { imageType } from '@/types/image'
import { ColorType } from '@/types/color'
import { ContactType } from '@/types/contacts'
import { PodcasterType } from '@/types/podcasters'

type PodcastType = {
  author: string
  brief: string
  color: ColorType
  contacts: ContactType[]
  description: string
  episodeCount: number
  hasPopularEpisodes: boolean
  image: imageType
  isCustomized: boolean
  latestEpisodePubDate: Date
  payEpisodeCount: number
  payType: string
  permissions: any
  pid: string
  podcasters: PodcasterType[]
  readTrackInfo?: any
  status: string
  subscriptionCount: number
  subscriptionPush: boolean
  subscriptionPushPriority: string
  subscriptionStar: boolean
  subscriptionStatus: string
  syncMode: string
  title: string
  topicLabels?: any
  type: string
}

type PodcastBulletinType = {
  content: string
  createdAt: string
  id: string
  offline: boolean
  pictures: imageType[]
  podcast: PodcastType
  reactions: {
    count: number
    name: string
    reacted: boolean
    url: string
  }[]
  uniqueVisitorCount: number
}

export type { PodcastType, PodcastBulletinType }
