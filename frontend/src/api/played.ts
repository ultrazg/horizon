import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  playedList: '/played_list',
  updatePlayedList: '/episode_played_history_list_update',
}

type playedListType = {
  uid: string
}

export type updatePlayedListType = {
  eid: string
}

/** 查询收听历史 */
export const playedList = (params: playedListType): Promise<responseType> =>
  httpRequest.post(api.playedList, params)

/** 更新收听历史 */
export const updatePlayedList = (
  params: updatePlayedListType,
): Promise<responseType> => httpRequest.post(api.updatePlayedList, params)
