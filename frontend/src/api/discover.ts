import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  discovery: 'discovery',
  refreshEpisodeCommend: 'refresh_episode_recommend',
}

type discoveryType = {
  loadMoreKey: '' | 'mediumDiscoveryPictorial' | 'discoveryTopic' | 'pick'
}

/** 获取首页榜单、推荐 */
export const discovery = (params: discoveryType): Promise<responseType> =>
  httpRequest.post(api.discovery, params)

/** 首页-刷新「大家都在听」推荐 */
export const refreshEpisodeCommend = (): Promise<responseType> =>
  httpRequest.post(api.refreshEpisodeCommend)
