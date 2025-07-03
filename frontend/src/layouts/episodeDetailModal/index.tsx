import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Modal } from '@/components'
import { ScrollArea, Spinner } from '@radix-ui/themes'
import { setModalFunction } from '@/utils/showEpisodeDetailModal'
import { EpisodeType } from '@/types/episode'
import { episodeDetail } from '@/api/episode'
import { useDisplayInfo } from '@/hooks'
import { DialogType, ShowMessageDialog } from '@/utils'
import { BrowserOpenURL } from 'wailsjs/runtime'
import dayjs from 'dayjs'
import styles from './index.module.scss'

type EpisodeDetailModalType = {
  showEpisodeDetailModal: (eid: string) => void
}

const EpisodeDetailModalContext = createContext<
  EpisodeDetailModalType | undefined
>(undefined)

export const EpisodeDetailModalProvider = ({ children }: { children: any }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [width] = useState<number>(useDisplayInfo().Width)
  const [height] = useState<number>(useDisplayInfo().Height)
  const [loading, setLoading] = useState<boolean>(false)
  const [detailData, setDetailData] = useState<EpisodeType>()

  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = event.target as HTMLElement
    const linkElement = target.closest('a')
    const href = linkElement?.getAttribute('href')

    /**
     * 阻止 shownotes 中的 a 标签的默认跳转行为
     */
    if (linkElement) {
      event.preventDefault()
      if (href) {
        ShowMessageDialog(
          DialogType.QUESTION,
          '跳转提示',
          `是否在浏览器中打开链接？\r\n${href}`,
        ).then((res) => {
          if (res === 'Yes' || res === '是') {
            BrowserOpenURL(href)
          }
        })
      }
    }
  }

  /**
   * 获取单集详情
   */
  const getEpisodeDetail = (eid: string) => {
    setLoading(true)
    const params = { eid }

    episodeDetail(params)
      .then((res) => setDetailData(res.data.data))
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const showEpisodeDetailModal = useCallback((eid: string) => {
    setOpen(true)
    getEpisodeDetail(eid)
  }, [])

  useEffect(() => {
    setModalFunction(showEpisodeDetailModal)
  }, [showEpisodeDetailModal])

  useEffect(() => {
    /**
     * 处理 shownotes 中的字体颜色
     */
    const container = containerRef.current
    if (container) {
      const elementsWithStyle = container.querySelectorAll('[style]')
      elementsWithStyle.forEach((element) => {
        const style = element.getAttribute('style')
        if (style) {
          const newStyle = style.replace(/color\s*:\s*[^;]+;\s*/gi, '')
          element.setAttribute('style', newStyle)
        }
      })
    }
  }, [detailData])

  return (
    <EpisodeDetailModalContext.Provider value={{ showEpisodeDetailModal }}>
      {children}

      <Modal
        title="单集详情"
        width={`${width * 0.6}px`}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Spinner loading={loading}>
          <ScrollArea
            type="hover"
            scrollbars="vertical"
            style={{ maxHeight: `${height * 0.7}px` }}
          >
            <div className={styles['episode-detail-modal-layout']}>
              <h3>{detailData?.title}</h3>

              <div className={styles['info']}>
                {detailData?.duration && Math.floor(detailData?.duration / 60)}
                分钟 · {dayjs(detailData?.pubDate).format('YYYY/MM/DD')}
              </div>

              <div className={styles['episode-detail-html-content']}>
                <div
                  ref={containerRef}
                  dangerouslySetInnerHTML={{ __html: detailData?.shownotes }}
                  onClick={handleClick}
                />
              </div>
            </div>
          </ScrollArea>
        </Spinner>
      </Modal>
    </EpisodeDetailModalContext.Provider>
  )
}
