import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  favoriteEpisodeList: 'favorite_episode_list',
  commentCollectList: 'comment_collect_list',
}

type commentCollectListType = {
  loadMoreKey?: string
}

/** 查询已收藏的单集 */
export const favoriteEpisodeList = (): Promise<responseType> =>
  httpRequest.post(api.favoriteEpisodeList)

/** 查询已收藏的评论 */
export const commentCollectList = (
  params: commentCollectListType,
): Promise<responseType> => httpRequest.post(api.commentCollectList, params)
