import axios from 'axios'
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

/**
 * 扫码登录：创建二维码
 * 这两个接口由 bridge/http.go 直接转发到小宇宙 web-api（xz 服务里没有），
 * 且登录成功后 token 在**响应头**里，所以这里用原生 axios 拿完整响应。
 */
export const qrcodeCreate = () =>
  axios.post('/qrcode_create', { clientId: 'xyz-web' })

/** 扫码登录：查询扫码状态（成功时响应头带 access/refresh token，status 为 USED） */
export const qrcodeLogin = (id: string) =>
  axios.post('/qrcode_login', { id })
