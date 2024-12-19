import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  episodeList: 'episode_list',
}

type episodeListType = {
  pid: string
  loadMoreKey?: {}
}

/** 查询单集列表 */
export const episodeList = (params: episodeListType): Promise<responseType> =>
  httpRequest.post(api.episodeList, params)
