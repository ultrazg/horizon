import React from 'react'
import { ColorfulShadow } from '@/components'
import { QuoteIcon, UpdateIcon } from '@radix-ui/react-icons'
import { Button, Skeleton } from '@radix-ui/themes'
import styles from './index.module.scss'
import { PopularType, TargetType } from '@/pages/home'
import { showEpisodeDetailModal, ShowPodcastDetailModal, toast } from '@/utils'
import { usePlayer } from '@/hooks'
import { PlayerEpisodeInfoType } from '@/utils/player'
import { CONSTANT } from '@/types/constant'

type IProps = {
  data: PopularType
  loading: boolean
  onRefresh: () => void
}

/**
 * 发现-大家都在听
 * @constructor
 */
const PopularPart: React.FC<IProps> = ({ data, loading, onRefresh }) => {
  const player = usePlayer()

  return (
    <div className={styles['popular-layout']}>
      <h3>大家都在听</h3>

      <Skeleton loading={loading}>
        <div className={styles['popular-content']}>
          {data?.target?.map((item: TargetType) => (
            <div
              className={styles['popular-item']}
              key={item.episode.eid}
            >
              <div className={styles['popular-info']}>
                <div className={styles['cover-box']}>
                  <ColorfulShadow
                    src={
                      item.episode?.image
                        ? item.episode.image.picUrl
                        : item.episode.podcast.image.picUrl
                    }
                    mask
                    curPointer
                    onPlay={() => {
                      const episodeInfo: PlayerEpisodeInfoType = {
                        title: item.episode.title,
                        eid: item.episode.eid,
                        pid: item.episode.pid,
                        cover: item.episode?.image
                          ? item.episode.image.picUrl
                          : item.episode.podcast.image.picUrl,
                        liked: item.episode.isFavorited,
                      }

                      player.load(item.episode.media.source.url, episodeInfo)
                      player.play()
                    }}
                    onAddToPlaylist={() => {
                      const episodeInfo: PlayerEpisodeInfoType = {
                        title: item.episode.title,
                        eid: item.episode.eid,
                        pid: item.episode.pid,
                        cover: item.episode?.image
                          ? item.episode.image.picUrl
                          : item.episode.podcast.image.picUrl,
                        liked: item.episode.isFavorited,
                      }

                      const added = player.addToPlaylist(
                        item.episode.media.source.url,
                        episodeInfo,
                      )
                      toast(added ? '已添加到播放列表' : '已在播放列表中')
                    }}
                  />
                </div>
                <div className={styles['info-box']}>
                  <p
                    onClick={() => {
                      ShowPodcastDetailModal({
                        pid: item.episode.podcast.pid,
                      }).catch(() => {
                        toast(CONSTANT.ERROR_PODCAST_DETAIL_VIEW, {
                          type: 'warn',
                        })
                      })
                    }}
                  >
                    {item.episode.podcast.title}
                  </p>
                  <p
                    title={item.episode.title}
                    onClick={() => {
                      showEpisodeDetailModal(item.episode.eid)
                    }}
                  >
                    {item.episode.title}
                  </p>
                  <p>
                    <QuoteIcon />
                    {item.recommendation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Skeleton>

      <div className={styles['reload-button']}>
        <Button
          size="2"
          variant="soft"
          color="gray"
          onClick={() => onRefresh()}
          loading={loading}
        >
          <UpdateIcon />
          换一换
        </Button>
      </div>
    </div>
  )
}

export default PopularPart
