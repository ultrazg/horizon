import { PodcastType } from '@/types/podcast'
import { imageType } from '@/types/image'
import { MediaType } from '@/types/media'

type EpisodeType = {
  clapCount: number
  commentCount: number
  description: string
  duration: number
  eid: string
  enclosure: any
  favoriteCount: number
  image?: imageType
  ipLoc: string
  isCustomized: boolean
  isFavorited: boolean
  isFinished: boolean
  isPicked: boolean
  isPlayed: boolean
  isPrivateMedia: boolean
  labels?: Array<any>
  media: MediaType
  mediaKey: string
  payType: string
  permissions: any
  pid: string
  playCount: number
  podcast: PodcastType
  pubDate: Date
  readTrackInfo?: any
  shownotes: any
  sponsors?: Array<any>
  status: string
  title: string
  type: string
  wechatShare?: any
}

export type { EpisodeType }
