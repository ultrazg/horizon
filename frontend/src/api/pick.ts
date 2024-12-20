import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  pickListRecent: 'pick_list_recent',
}

type pickListRecentType = {
  uid: string
}

/** 查询个人主页「用户的喜欢」片段内容 */
export const pickListRecent = (
  params: pickListRecentType,
): Promise<responseType> => httpRequest.post(api.pickListRecent, params)
