import { EpisodeType } from '@/types/episode'
import { baseUserType } from '@/types/user'

type PickRecentType = {
  commentCount: number
  episode: EpisodeType
  id: string
  isLike: boolean
  likeCount: number
  pickedAt: string
  readTrackInfo: {}
  story: {
    emotion: string
    iconUrl: string
    text: string
  }
  type: string
  user: baseUserType
}

export type { PickRecentType }
