import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  commentPrimary: 'comment_primary',
  commentCollectCreate: 'comment_collect_create',
}

export type commentPrimaryType = {
  id: string
  order: 'HOT' | 'TIME' | 'TIMESTAMP' // 全部评论（HOT）、最新评论（TIME）、时点评论（TIMESTAMP）
  loadMoreKey?: {}
}

type commentCollectCreateType = {
  commentId: string
}

/** 查询单集的评论 */
export const commentPrimary = (
  params: commentPrimaryType,
): Promise<responseType> => httpRequest.post(api.commentPrimary, params)

/** 收藏评论 */
export const commentCollectCreate = (
  params: commentCollectCreateType,
): Promise<responseType> => httpRequest.post(api.commentCollectCreate, params)
