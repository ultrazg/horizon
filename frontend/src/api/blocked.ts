import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  blockedUserLists: 'blocked_user_lists',
  blockedUserRemove: 'blocked_user_remove',
}

type blockedUserRemoveType = {
  uid: string
}

/** 获取已拉黑的用户列表 */
export const blockedUserLists = (): Promise<responseType> =>
  httpRequest.post(api.blockedUserLists)

/** 取消拉黑用户 */
export const blockedUserRemove = (
  params: blockedUserRemoveType,
): Promise<responseType> => httpRequest.post(api.blockedUserRemove, params)
