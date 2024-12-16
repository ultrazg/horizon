import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  search: 'search',
}

type searchType = {
  keyword: string
  type: string
  loadMoreKey?: {}
}

/** 搜索 */
export const search = (params: searchType): Promise<responseType> =>
  httpRequest.post(api.search, params)
