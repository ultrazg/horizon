import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  playedList: '/played_list',
}

type playedListType = {
  uid: string
}

/** 查询收听历史 */
export const playedList = (params: playedListType): Promise<responseType> =>
  httpRequest.post(api.playedList, params)
