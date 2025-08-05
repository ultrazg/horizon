import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  favoriteEpisodeList: 'favorite_episode_list',
  favoriteEpisodeUpdate: 'favorite_episode_update',
  commentCollectList: 'comment_collect_list',
  commentCollectRemove: 'comment_collect_remove',
}

type commentCollectListType = {
  loadMoreKey?: string
}

export type commentCollectRemoveType = {
  commentId: string
}

type favoriteEpisodeUpdateType = {
  eid: string
  favorited: boolean
}

/** 查询已收藏的单集 */
export const favoriteEpisodeList = (): Promise<responseType> =>
  httpRequest.post(api.favoriteEpisodeList)

/** 查询已收藏的评论 */
export const commentCollectList = (
  params: commentCollectListType,
): Promise<responseType> => httpRequest.post(api.commentCollectList, params)

/** 删除已收藏的评论 */
export const commentCollectRemove = (
  params: commentCollectRemoveType,
): Promise<responseType> => httpRequest.post(api.commentCollectRemove, params)

/** 更新已收藏的单集 */
export const favoriteEpisodeUpdate = (
  params: favoriteEpisodeUpdateType,
): Promise<responseType> => httpRequest.post(api.favoriteEpisodeUpdate, params)
