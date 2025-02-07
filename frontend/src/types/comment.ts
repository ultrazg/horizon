import { baseUserType } from '@/types/user'
import { EpisodeType } from '@/types/episode'

type CommentPrimaryType = {
  author: baseUserType
  episode: EpisodeType
  badges: any[]
  collected: boolean
  collectedAt: string
  createdAt: string
  id: string
  ipLoc: string
  isAuthorMuted: boolean
  level: number
  likeCount: number
  liked: boolean
  owner: {
    id: string
    type: string
  }
  pid: string
  pinned: boolean
  text: string
  status: string
  type: string
  authorAssociation: string
  replyCount: number
  threadReplyCount: number
  replyToComment: {
    author: baseUserType
    badges: any[]
    collected: boolean
    collectedAt: string
    createdAt: string
    id: string
    ipLoc: string
    isAuthorMuted: boolean
    level: number
    likeCount: number
    liked: boolean
    owner: {
      id: string
      type: string
    }
    pid: string
    pinned: boolean
    text: string
    status: string
    type: string
  }
  replies?: {
    replyToComment?: CommentPrimaryType
  } & CommentPrimaryType[]
}

type FavoriteCommentType = {
  author: baseUserType
  episode: EpisodeType
  badges: any[]
  collected: boolean
  collectedAt: string
  createdAt: string
  id: string
  ipLoc: string
  isAuthorMuted: boolean
  level: number
  likeCount: number
  liked: boolean
  owner: {
    id: string
    type: string
  }
  pid: string
  pinned: boolean
  text: string
  status: string
  type: string
}

export type { FavoriteCommentType, CommentPrimaryType }
