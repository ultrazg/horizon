import { imageType } from '@/types/image'

type userType = {
  uid: string
  bio?: string
  avatar?: string
  nickname?: string
  gender?: genderType
  industry?: string
  mobilePhoneNumber?: string
  ipLoc?: string
  wechatUserInfo?: wechatUserInfoType
  jikeUserInfo?: jikeUserInfoType
}

type baseUserType = {
  avatar: {
    picture: imageType
  }
  bio?: string
  gender?: genderType
  ipLoc: string
  isBlockedByViewer: boolean
  isCancelled: boolean
  isNicknameSet: boolean
  isInvited: boolean
  nickname: string
  relation: string
  uid: string
}

type genderType = 'MALE' | 'FEMALE'

type wechatUserInfoType = {
  nickName?: string
}

type jikeUserInfoType = {
  nickname?: string
}

type userStats = {
  followerCount: number
  followingCount: number
  subscriptionCount: number
  totalPlayedSeconds: number
}

type userPreferenceType = {
  isRecentPlayedHidden: boolean
  isListenMileageHiddenInComment: boolean
  isStickerLibraryHidden: boolean
  isStickerBoardHidden: boolean
  rejectHotPush: boolean
  rejectRecommendation: boolean
}

export const USER_PREFERENCE_ENUM = {
  isRecentPlayedHidden: 'isRecentPlayedHidden',
  isListenMileageHiddenInComment: 'isListenMileageHiddenInComment',
  isStickerLibraryHidden: 'isStickerLibraryHidden',
  isStickerBoardHidden: 'isStickerBoardHidden',
  rejectHotPush: 'rejectHotPush',
  rejectRecommendation: 'rejectRecommendation',
}

export type {
  userType,
  userStats,
  userPreferenceType,
  genderType,
  baseUserType,
}
