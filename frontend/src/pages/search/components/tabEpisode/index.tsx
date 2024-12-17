import React from 'react'
import { ColorfulShadow } from '@/components'
import { SlBubble, SlEarphones } from 'react-icons/sl'
import { EpisodeType } from '@/types/episode'
import dayjs from 'dayjs'
import './index.modules.scss'

type IProps = {
  data: { records: EpisodeType[]; loadMoreKey: {} }
  onLoadMore: () => void
}

export const TabEpisode: React.FC<IProps> = ({ data, onLoadMore }) => {
  return (
    <div className="search-result-episode-layout">
      {data.records.map((item) => (
        <div
          key={item.eid}
          className="search-result-episode-item"
        >
          <div className="left">
            <ColorfulShadow
              className="episode-cover"
              curPointer
              mask
              src={item?.image ? item.image.picUrl : item.podcast.image.picUrl}
            />
          </div>
          <div className="right">
            <p>{item.title}</p>
            <p title={item.description}>{item.description}</p>
            <p>
              <span>
                {Math.floor(item.duration / 60)}分钟 ·{' '}
                {dayjs(item.pubDate).format('MM/DD')}
              </span>
              <span>
                <SlEarphones />
                {item.playCount}
                <SlBubble />
                {item.commentCount}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
