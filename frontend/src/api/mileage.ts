import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  mileageGet: '/mileage_get',
  mileageList: '/mileage_list',
  mileageUpdate: '/mileage_update',
}

type mileageListType = {
  all?: boolean
}

type trackingType = {
  eid: string
  pid: string
  startPlayingTimestamp: number
  endPlayingTimestamp: number
  isSpeaker: boolean
  isOffline: boolean
  isTrial: boolean
  withSpeed: number
}

export type mileageUpdateType = {
  tracking: trackingType[]
}

/** 查询收听数据概览 */
export const mileageGet = (): Promise<responseType> =>
  httpRequest.post(api.mileageGet)

/** 查询收听数据概览 */
export const mileageList = (params: mileageListType): Promise<responseType> =>
  httpRequest.post(api.mileageList, params)

/** 更新收听数据概览 */
export const mileageUpdate = (
  params: mileageUpdateType,
): Promise<responseType> => httpRequest.post(api.mileageUpdate, params)
