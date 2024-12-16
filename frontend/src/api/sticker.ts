import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  sticker: '/sticker',
}

type stickerType = {
  uid: string
}

/** 查询用户已获得的贴纸 */
export const sticker = (params: stickerType): Promise<responseType> =>
  httpRequest.post(api.sticker, params)
