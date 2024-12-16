import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  sendCode: '/sendCode',
  login: '/login',
  refreshToken: '/refresh_token',
}

type sendCodeType = {
  mobilePhoneNumber: string
  areaCode?: string
}

type loginType = {
  mobilePhoneNumber: string
  verifyCode: string
  areaCode?: string
}

type refreshTokenType = {
  'x-jike-refresh-token': string
  'x-jike-access-token': string
}

/** 发送短信验证码 */
export const sendCode = (params: sendCodeType): Promise<responseType> =>
  httpRequest.post(api.sendCode, params)

/** 短信登录 */
export const login = (params: loginType): Promise<responseType> =>
  httpRequest.post(api.login, params)

/** 刷新 token */
export const refreshToken = (params: refreshTokenType): Promise<responseType> =>
  httpRequest.post(api.refreshToken, params)
