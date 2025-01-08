import { createContext, useCallback, useEffect, useState } from 'react'
import { Modal } from '@/components'
import { Button, Dialog, Flex, ScrollArea, Spinner } from '@radix-ui/themes'
import { setModalFunction } from '@/utils/showEpisodeDetailModal'
import { EpisodeType } from '@/types/episode'
import { episodeDetail } from '@/api/episode'
import { useDisplayInfo } from '@/hooks'
import { DialogType, ShowMessageDialog } from '@/utils'
import { BrowserOpenURL } from 'wailsjs/runtime'
import './index.modules.scss'

type EpisodeDetailModalType = {
  showEpisodeDetailModal: (eid: string) => void
}

const EpisodeDetailModalContext = createContext<
  EpisodeDetailModalType | undefined
>(undefined)

export const EpisodeDetailModalPovider = ({ children }: { children: any }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [width] = useState<number>(useDisplayInfo().Width)
  const [height] = useState<number>(useDisplayInfo().Height)
  const [loading, setLoading] = useState<boolean>(false)
  const [detailData, setDetailData] = useState<EpisodeType>()

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
            type="scroll"
            scrollbars="vertical"
            style={{ height: `${height * 0.7}px` }}
          >
            <div className="episode-detail-modal-wrapper">
              <div
                dangerouslySetInnerHTML={{ __html: detailData?.shownotes }}
                onClick={handleClick}
              />
            </div>
          </ScrollArea>
        </Spinner>

        <Flex
          gap="3"
          mt="4"
          justify="end"
        >
          <Dialog.Close>
            <Button
              variant="soft"
              color="gray"
            >
              关闭
            </Button>
          </Dialog.Close>
        </Flex>
      </Modal>
    </EpisodeDetailModalContext.Provider>
  )
}
