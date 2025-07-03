import React from 'react'
import { ColorfulShadow, Empty } from '@/components'
import { SlBubble, SlEarphones } from 'react-icons/sl'
import { EpisodeType } from '@/types/episode'
import dayjs from 'dayjs'
import styles from './index.module.scss'
import { isEmpty } from 'lodash'
import { Button } from '@radix-ui/themes'
import { showEpisodeDetailModal } from '@/utils'
import { usePlayer } from '@/hooks'
import { PlayerEpisodeInfoType } from '@/utils/player'

type IProps = {
  data: { records: EpisodeType[]; loadMoreKey: {} }
  onLoadMore: (loadMoreKey: {}) => void
  loading: boolean
}

export const TabEpisode: React.FC<IProps> = ({ data, onLoadMore, loading }) => {
  const player = usePlayer()

  return (
    <div className={styles['search-result-episode-layout']}>
      {data.records.length === 0 && <Empty />}
      {data.records.map((item) => (
        <div
          key={item.eid}
          className={styles['search-result-episode-item']}
        >
          <div className={styles['left']}>
            <ColorfulShadow
              className={styles['episode-cover']}
              curPointer
              mask
              src={item?.image ? item.image.picUrl : item.podcast.image.picUrl}
              onClick={() => {
                const episodeInfo: PlayerEpisodeInfoType = {
                  title: item.title,
                  eid: item.eid,
                  pid: item.podcast.pid,
                  cover: item?.image
                    ? item.image.picUrl
                    : item.podcast.image.picUrl,
                  liked: item.isFavorited,
                }

                player.load(item.media.source.url, episodeInfo)
                player.play()
              }}
            />
          </div>
          <div
            className={styles['right']}
            onClick={() => {
              showEpisodeDetailModal(item.eid)
            }}
          >
            <p>{item.title}</p>
            <p title={item.description}>{item.description}</p>
            <p>
              <span>
                {Math.floor(item.duration / 60)}分钟 ·{' '}
                {dayjs(item.pubDate).format('YYYY/MM/DD')}
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

      <div className={styles['episode-load-more-button']}>
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
