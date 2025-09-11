import { EpisodeType } from '@/types/episode'
import { baseUserType } from '@/types/user'
import { CommentPrimaryType } from '@/types/comment'

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

type EditorPickHistoryType = {
  date: string
  dateIsoStr: string
  picks: {
    comment: CommentPrimaryType
    episode: EpisodeType
    recentAudiences: baseUserType[]
  }[]
}

export type { PickRecentType, EditorPickHistoryType }
