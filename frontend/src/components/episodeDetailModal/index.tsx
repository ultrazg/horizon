import React, { useEffect, useState } from 'react'
import { Modal } from '@/components'
import { modalType } from '@/types/modal'
import { Button, Dialog, Flex, ScrollArea, Spinner } from '@radix-ui/themes'
import { useDisplayInfo } from '@/hooks'
import { episodeDetail } from '@/api/episode'
import './index.moduless.scss'
import { EpisodeType } from '@/types/episode'

type IProps = {
  eid: string
} & modalType

/**
 * 单集详情弹窗
 * @param open    是否打开
 * @param onClose 关闭弹窗
 * @param width   宽度
 * @constructor
 */
export const EpisodeDetailModal: React.FC<IProps> = ({
  open,
  onClose,
  width,
  eid,
}) => {
  const [height] = React.useState<number>(useDisplayInfo().Height)
  const [loading, setLoading] = useState<boolean>(false)
  const [detailData, setDetailData] = useState<EpisodeType>()

  /**
   * 获取单集详情
   */
  const getEpisodeDetail = () => {
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

  useEffect(() => {
    if (open) {
      getEpisodeDetail()
    }

    return () => {
      setDetailData(undefined)
    }
  }, [open])

  return (
    <Modal
      title="单集详情"
      open={open}
      onClose={onClose}
      width={width}
    >
      <Spinner loading={loading}>
        <ScrollArea
          type="scroll"
          scrollbars="vertical"
          style={{ height: `${height * 0.7}px` }}
        >
          <div className="episode-detail-modal-wrapper">
            <div dangerouslySetInnerHTML={{ __html: detailData?.shownotes }} />
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
  )
}
