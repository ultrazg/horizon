import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  commentPrimary: 'comment_primary',
  commentThread: 'comment_thread',
  commentCollectCreate: 'comment_collect_create',
  commentLikeUpdate: 'comment_like_update',
}

export type commentPrimaryType = {
  id: string
  order: 'HOT' | 'TIME' | 'TIMESTAMP' // 全部评论（HOT）、最新评论（TIME）、时点评论（TIMESTAMP）
  loadMoreKey?: {}
}

export type commentThreadType = {
  primaryCommentId: string
  order: 'SMART' | 'TIME' // 全部评论（SMART）、最新评论（TIME）
}

type commentCollectCreateType = {
  commentId: string
}

type commentLikeUpdateType = {
  id: string
  liked: boolean
}

/** 查询单集的评论 */
export const commentPrimary = (
  params: commentPrimaryType,
): Promise<responseType> => httpRequest.post(api.commentPrimary, params)

/** 查询回复评论 */
export const commentThread = (
  params: commentThreadType,
): Promise<responseType> => httpRequest.post(api.commentThread, params)

/** 收藏评论 */
export const commentCollectCreate = (
  params: commentCollectCreateType,
): Promise<responseType> => httpRequest.post(api.commentCollectCreate, params)

/** 点赞、取消点赞评论 */
export const commentLikeUpdate = (
  params: commentLikeUpdateType,
): Promise<responseType> => httpRequest.post(api.commentLikeUpdate, params)
