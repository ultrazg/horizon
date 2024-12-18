import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  podcastDetail: 'podcast_detail',
}

type podcastDetailType = {
  pid: string
}

/** 根据 pid 查询单集内容详情 */
export const podcastDetail = (
  params: podcastDetailType,
): Promise<responseType> => httpRequest.post(api.podcastDetail, params)
