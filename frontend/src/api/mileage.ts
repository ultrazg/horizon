import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  mileageGet: '/mileage_get',
  mileageList: '/mileage_list',
}

type mileageListType = {
  all?: boolean
}

/** 查询收听数据概览 */
export const mileageGet = (): Promise<responseType> =>
  httpRequest.post(api.mileageGet)

/** 查询收听数据概览 */
export const mileageList = (params: mileageListType): Promise<responseType> =>
  httpRequest.post(api.mileageList, params)
