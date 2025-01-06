import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  podcastDetail: 'podcast_detail',
  podcastRelated: 'podcast_related',
}

type podcastDetailType = {
  pid: string
}

type podcastRelatedType = {
  pid: string
}

/** 根据 pid 查询单集内容详情 */
export const podcastDetail = (
  params: podcastDetailType,
): Promise<responseType> => httpRequest.post(api.podcastDetail, params)

/** 相关节目推荐 */
export const podcastRelated = (
  params: podcastRelatedType,
): Promise<responseType> => httpRequest.post(api.podcastRelated, params)
