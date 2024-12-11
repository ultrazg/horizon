import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  blockedUserLists: 'blocked_user_lists',
  blockedUserRemove: 'blocked_user_remove',
  blockedUserCreate: 'blocked_user_create',
}

type blockedUserRemoveType = {
  uid: string
}

type blockedUserCreateType = {
  uid: string
}

/** 获取已拉黑的用户列表 */
export const blockedUserLists = (): Promise<responseType> =>
  httpRequest.post(api.blockedUserLists)

/** 取消拉黑用户 */
export const blockedUserRemove = (
  params: blockedUserRemoveType,
): Promise<responseType> => httpRequest.post(api.blockedUserRemove, params)

/** 拉黑用户 */
export const blockedUserCreate = (
  params: blockedUserCreateType,
): Promise<responseType> => httpRequest.post(api.blockedUserCreate, params)
