import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  blockedUserLists: 'blocked_user_lists',
}

/** 获取已拉黑的用户列表 */
export const blockedUserLists = (): Promise<responseType> =>
  httpRequest.post(api.blockedUserLists)
