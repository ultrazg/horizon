import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  episodeList: 'episode_list',
  episodeDetail: 'episode_detail',
}

type episodeListType = {
  pid: string
  order: string
  loadMoreKey?: {}
}

type episodeDetailType = {
  eid: string
}

/** 查询单集列表 */
export const episodeList = (params: episodeListType): Promise<responseType> =>
  httpRequest.post(api.episodeList, params)

/** 查询单集详情 */
export const episodeDetail = (
  params: episodeDetailType,
): Promise<responseType> => httpRequest.post(api.episodeDetail, params)
