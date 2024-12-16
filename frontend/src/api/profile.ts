import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  getProfile: 'get_profile',
}

type getProfileType = {
  uid: string
}

/** 根据 uid 查询用户的个人信息 */
export const getProfile = (params: getProfileType): Promise<responseType> =>
  httpRequest.post(api.getProfile, params)