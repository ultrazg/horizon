import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  userStats: 'user_stats',
  userPreferenceGet: 'user_preference_get',
  userPreferenceUpdate: 'user_preference_update',
}

type userStatsType = {
  uid: string
}

type userPreferenceUpdateType = {
  type: string
  flag: boolean
}

/** 查询用户统计数据 */
export const getUserStats = (params: userStatsType): Promise<responseType> =>
  httpRequest.post(api.userStats, params)

/** 查询用户偏好设置 */
export const getUserPreference = (): Promise<responseType> =>
  httpRequest.post(api.userPreferenceGet)

/** 更新用户偏好设置 */
export const updateUserPreference = (
  params: userPreferenceUpdateType,
): Promise<responseType> => httpRequest.post(api.userPreferenceUpdate, params)
