import React from 'react'
import './index.modules.scss'
import { ColorfulShadow } from '@/components'
import { Button } from '@radix-ui/themes'
import { PlusIcon } from '@radix-ui/react-icons'
import { PodcastType } from '@/types/podcast'
import dayjs from 'dayjs'

type IProps = {
  data: { records: PodcastType[]; loadMoreKey: {} }
  onLoadMore: () => void
}

export const TabPodcast: React.FC<IProps> = ({ data, onLoadMore }) => {
  return (
    <div className="search-result-podcast-layout">
      {data.records.map((item) => (
        <div
          className="search-result-podcast-item"
          key={item.pid}
        >
          <div className="left">
            <ColorfulShadow
              className="podcast-cover"
              curPointer
              src={item.image.picUrl}
            />

            <div className="podcast-info">
              <p>{item.title}</p>
              <p>{item.description}</p>
              <p>
                {item.author} ·{' '}
                {dayjs(item.latestEpisodePubDate).format('MM/DD')}更新
              </p>
            </div>
          </div>
          <div className="right">
            {item.subscriptionStatus === 'ON' ? (
              <Button
                variant="soft"
                color="gray"
              >
                已订阅
              </Button>
            ) : (
              <Button variant="soft">
                <PlusIcon />
                订阅
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
