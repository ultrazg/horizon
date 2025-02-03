import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  episodeList: 'episode_list',
  episodeDetail: 'episode_detail',
  episodeLiveCount: 'episode_live_count',
  episodePlayProgressUpdate: 'episode_play_progress_update',
}

type episodeListType = {
  pid: string
  order: string
  loadMoreKey?: {}
}

type episodeDetailType = {
  eid: string
}

type episodeLiveCountType = {
  eid: string
}

type episodePlayProgressUpdateType = {
  data: {
    eid: string
    pid: string
    progress: number
    playedAt: string
  }[]
}

/** 查询单集列表 */
export const episodeList = (params: episodeListType): Promise<responseType> =>
  httpRequest.post(api.episodeList, params)

/** 查询单集详情 */
export const episodeDetail = (
  params: episodeDetailType,
): Promise<responseType> => httpRequest.post(api.episodeDetail, params)

/** 查询单集正在收听的人数 */
export const episodeLiveCount = (
  params: episodeLiveCountType,
): Promise<responseType> => httpRequest.post(api.episodeLiveCount, params)

/** 更新单集播放进度 */
export const episodePlayProgressUpdate = (
  params: episodePlayProgressUpdateType,
): Promise<responseType> =>
  httpRequest.post(api.episodePlayProgressUpdate, params)
