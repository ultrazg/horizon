import React from 'react'
import { ColorfulShadow } from '@/components'
import { SlBubble, SlEarphones } from 'react-icons/sl'
import { EpisodeType } from '@/types/episode'
import dayjs from 'dayjs'
import './index.modules.scss'
import { isEmpty } from 'lodash'
import { Button } from '@radix-ui/themes'
import { showEpisodeDetailModal } from '@/utils'

type IProps = {
  data: { records: EpisodeType[]; loadMoreKey: {} }
  onLoadMore: (loadMoreKey: {}) => void
  loading: boolean
}

export const TabEpisode: React.FC<IProps> = ({ data, onLoadMore, loading }) => {
  return (
    <div className="search-result-episode-layout">
      {data.records.length === 0 && (
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
          <div
            className="right"
            onClick={() => {
              showEpisodeDetailModal(item.eid)
            }}
          >
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

      <div className="episode-load-more-button">
        {!isEmpty(data.loadMoreKey) && (
          <Button
            color="gray"
            onClick={() => {
              onLoadMore(data.loadMoreKey)
            }}
            loading={loading}
          >
            加载更多
          </Button>
        )}
      </div>
    </div>
  )
}
