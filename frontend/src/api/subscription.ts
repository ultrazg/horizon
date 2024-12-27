import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  subscription: '/subscription',
  updateSubscription: '/subscription_update',
}

type subscriptionType = {
  uid?: string
  loadMoreKey?: { [key: string]: any }
}

type updateSubscriptionType = {
  pid: string
  mode: 'ON' | 'OFF'
}

/** 查询订阅列表 */
export const subscription = (params: subscriptionType): Promise<responseType> =>
  httpRequest.post(api.subscription, params)

/** 更新订阅 */
export const updateSubscription = (
  params: updateSubscriptionType,
): Promise<responseType> => httpRequest.post(api.updateSubscription, params)
