import { httpRequest } from '@/utils'
import { responseType } from '@/types/response'

const api = {
  search: 'search',
}

export type searchType = {
  keyword: string
  type: 'PODCAST' | 'EPISODE' | 'USER'
  loadMoreKey?: {}
}

/** 搜索 */
export const search = (params: searchType): Promise<responseType> =>
  httpRequest.post(api.search, params)
