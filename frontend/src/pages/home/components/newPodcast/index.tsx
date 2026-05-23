import React from 'react'
import { NewPodcastType } from '@/pages/home'
import styles from './index.module.scss'
import { ColorfulShadow } from '@/components'
import { PlayerEpisodeInfoType } from '@/utils/player'
import { showEpisodeDetailModal, ShowPodcastDetailModal, toast } from '@/utils'
import { usePlayer } from '@/layouts/player'
import { QuoteIcon } from '@radix-ui/react-icons'
import { CONSTANT } from '@/types/constant'

type IProps = {
  data: NewPodcastType
}

const NewPodcast: React.FC<IProps> = ({ data }) => {
  const player = usePlayer()

  return (
    <div className={styles['new-podcast-layout']}>
      <h3>TA 们开始创作新播客</h3>

      <div className={styles['new-podcast-content']}>
        {data?.map((item) => {
          return (
            <div
              className={styles['new-podcast-item']}
              key={item.episode.eid}
            >
              <div className={styles['new-podcast-info']}>
                <div className={styles['cover-box']}>
                  <ColorfulShadow
                    src={item.episode.podcast.image.picUrl}
                    mask
                    curPointer
                    onClick={() => {
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
                    title={item.episode.podcast.title}
                  >
                    {item.episode.podcast.title}
                  </p>
                  <p
                    onClick={() => {
                      showEpisodeDetailModal(item.episode.eid)
                    }}
                    title={item.episode.title}
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
          )
        })}
      </div>
    </div>
  )
}

export default NewPodcast
