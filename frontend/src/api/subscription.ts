import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  subscription: '/subscription',
}

type subscriptionType = {
  uid?: string
  loadMoreKey?: { [key: string]: any }
}

/** 查询订阅列表 */
export const subscription = (params: subscriptionType): Promise<responseType> =>
  httpRequest.post(api.subscription, params)
