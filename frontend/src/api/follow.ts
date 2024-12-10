import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  following: 'following_list',
  follower: 'follower_list',
}

type followingType = {
  uid: string
}

type followerType = {
  uid: string
}

/** 根据 uid 查询关注的人列表 */
export const following = (params: followingType): Promise<responseType> =>
  httpRequest.post(api.following, params)

/** 根据 uid 查询粉丝列表 */
export const follower = (params: followerType): Promise<responseType> =>
  httpRequest.post(api.follower, params)
