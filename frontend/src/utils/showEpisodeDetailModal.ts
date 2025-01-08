let addEpisodeDetailModalFunction: any

export const setModalFunction = (func: (eid: string) => void) => {
  addEpisodeDetailModalFunction = func
}

/**
 * 全局单集详情弹窗
 * @param eid 单集 ID
 * @example
 * import { showEpisodeDetailModal } from '@/utils'
 * showEpisodeDetailModal('EID')
 */
export const showEpisodeDetailModal = (eid: string) => {
  if (addEpisodeDetailModalFunction) {
    addEpisodeDetailModalFunction(eid)
  } else {
    console.warn('Episode Detail Modal function is not initialized.')
  }
}
