import { ColorType } from '@/types/color'
import { ContactType } from '@/types/contacts'
import { imageType } from '@/types/image'
import { PodcasterType } from '@/types/podcasters'

type AuthorshipType = {
  author: string
  brief: string
  color: ColorType
  contacts: ContactType[]
  description: string
  episodeCount: number
  hasPopularEpisodes: boolean
  image: imageType
  isCustomized: boolean
  latestEpisodePubDate: string
  payEpisodeCount: number
  payType: string
  pid: string
  podcasters: PodcasterType[]
  status: string
  subscriptionCount: number
  subscriptionPush: boolean
  subscriptionPushPriority: string
  subscriptionStar: boolean
  subscriptionStatus: string
  syncMode: string
  title: string
  topicLabels: any
  type: string
}

export type { AuthorshipType }
