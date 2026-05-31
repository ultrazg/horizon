import { httpRequest } from '@/utils'

const api = {
  privateMediaGet: 'private_media_get',
}

export type PrivateMediaGetReq = {
  eid: string
}

export type PrivateMediaGetResp = {
  data: {
    url: string
  }
}

/** 查询付费单集的音频链接 */
export const PrivateMediaGet = (params: PrivateMediaGetReq) =>
  httpRequest.post<PrivateMediaGetResp>(api.privateMediaGet, params)
