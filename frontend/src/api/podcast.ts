import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  podcastDetail: 'podcast_detail',
  podcastRelated: 'podcast_related',
  podcastGetInfo: 'podcast_get_info',
  podcastBulletin: 'podcast_bulletin',
}

type podcastDetailType = {
  pid: string
}

type podcastRelatedType = {
  pid: string
}

type podcastGetInfoType = {
  pid: string
}

type podcastBulletinType = {
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

/** 获取节目信息 */
export const podcastGetInfo = (
  params: podcastGetInfoType,
): Promise<responseType> => httpRequest.post(api.podcastGetInfo, params)

/** 获取节目公告 */
export const podcastBulletin = (
  params: podcastBulletinType,
): Promise<responseType> => httpRequest.post(api.podcastBulletin, params)
