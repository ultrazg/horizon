import React, { useState } from 'react'
import { ScrollArea, Separator } from '@radix-ui/themes'
import { EyeOpenIcon } from '@radix-ui/react-icons'
import { Modal } from '@/components'
import { modalType } from '@/types/modal'
import { PodcastBulletinType } from '@/types/podcast'
import './index.modules.scss'
import { useDisplayInfo } from '@/hooks'
import dayjs from 'dayjs'

type IProps = {
  data?: PodcastBulletinType
} & modalType

/**
 * 节目公告弹窗
 * @param open
 * @param onClose
 * @param data
 * @constructor
 */
export const PodcastBulletinModal: React.FC<IProps> = ({
  open,
  onClose,
  data,
}) => {
  const [height] = useState(useDisplayInfo().Height * 0.4)

  return (
    <Modal
      title="节目公告"
      open={open}
      onClose={onClose}
    >
      {data ? (
        <div className="PBM-wrapper">
          <div className="PBM-podcast-info">
            <div className="left">
              <img src={data.podcast.image.picUrl} />
            </div>
            <div className="middle">{data.podcast.title}</div>
            <div className="right">
              <EyeOpenIcon /> {data.uniqueVisitorCount}
            </div>
          </div>

          <Separator
            my="3"
            size="4"
          />

          <ScrollArea
            type="hover"
            scrollbars="vertical"
            style={{ maxHeight: height }}
          >
            <div className="bulletin-content">{data.content}</div>

            {data.pictures.length > 0 &&
              data.pictures.map((item) => (
                <img
                  key={item.picUrl}
                  src={item.picUrl}
                  alt="bulletin-img"
                />
              ))}

            <div className="create-time">
              {dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss')} 发布
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            color: 'gray',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          暂无数据
        </div>
      )}
    </Modal>
  )
}
