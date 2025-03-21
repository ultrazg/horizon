import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  pickListRecent: 'pick_list_recent',
  pickListHistory: 'pick_list_history',
}

type pickListRecentType = {
  uid: string
}

type pickListHistoryType = {
  uid: string
  loadMoreKey?: {}
}

/** 查询个人主页「用户的喜欢」片段内容 */
export const pickListRecent = (
  params: pickListRecentType,
): Promise<responseType> => httpRequest.post(api.pickListRecent, params)

/** 查询个人主页「用户的喜欢」内容 */
export const pickListHistory = (
  params: pickListHistoryType,
): Promise<responseType> => httpRequest.post(api.pickListHistory, params)
