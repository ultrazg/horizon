import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  relationUpdate: 'relation_update',
}

type relationUpdataType = {
  uid: string
  relation: string
}

/** 关注或取关用户 */
export const relationUpdata = (
  params: relationUpdataType,
): Promise<responseType> => httpRequest.post(api.relationUpdate, params)
