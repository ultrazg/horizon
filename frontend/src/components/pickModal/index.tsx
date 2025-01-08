import React, { useEffect, useState } from 'react'
import { ColorfulShadow, Modal } from '@/components'
import { modalType } from '@/types/modal'
import {
  Button,
  Card,
  Dialog,
  Flex,
  ScrollArea,
  Separator,
  Spinner,
} from '@radix-ui/themes'
import { useDisplayInfo } from '@/hooks'
import { pickListHistory } from '@/api/pick'
import { PickRecentType } from '@/types/pick'
import dayjs from 'dayjs'
import { CONSTANT } from '@/types/constant'
import './index.modules.scss'

type IProps = {
  perspective: '他' | '她' | 'TA'
  uid: string
  total: number
} & modalType

/**
 * 「TA的喜欢」弹窗
 * @param perspective
 * @param uid
 * @param open
 * @param total
 * @param onClose
 * @constructor
 */
export const PickModal: React.FC<IProps> = ({
  perspective,
  uid,
  open,
  total,
  onClose,
}) => {
  const [height] = useState(useDisplayInfo().Height * 0.6)
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState<PickRecentType[]>([])

  const getData = (loadMoreKey?: {}) => {
    setLoading(true)

    const params = {
      uid,
      loadMoreKey,
    }

    pickListHistory(params)
      .then((res) => {
        setRecords(res.data.data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (open) getData()
  }, [open])

  return (
    <Modal
      title={`${perspective}的喜欢(${total})`}
      open={open}
      onClose={onClose}
    >
      <Spinner loading={loading}>
        <ScrollArea
          type="auto"
          scrollbars="vertical"
          style={{ height }}
        >
          <div className="pm-like-content">
            {records.map((item) => (
              <Card
                className="pm-like-item"
                key={item.id}
              >
                <div className="top">
                  <span>{dayjs(item.pickedAt).format('MM/DD')}</span>
                  <span>
                    <span>{item.likeCount}</span>
                    <img
                      src={item.story.iconUrl}
                      alt="like_icon"
                    />
                  </span>
                </div>
                <div
                  className="middle"
                  title={item.story.text}
                >
                  {item.story.text}
                </div>
                <Separator
                  my="3"
                  size="4"
                />
                <div className="bottom">
                  {item.episode.status === 'REMOVED' ? (
                    <div className="episode-removed">
                      {CONSTANT.EPISODE_STATUS_REMOVED}
                    </div>
                  ) : (
                    <>
                      <div className="left">
                        <ColorfulShadow
                          className="episode-cover"
                          curPointer
                          src={
                            item.episode?.image
                              ? item.episode.image.picUrl
                              : item.episode.podcast.image.picUrl
                          }
                        />
                      </div>
                      <div className="right">
                        <p>{item.episode.title}</p>
                        <p>{item.episode.podcast.title}</p>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Spinner>
    </Modal>
  )
}
