import React from 'react'
import styles from './index.module.scss'
import { ColorfulShadow } from '@/components'
import { ChatBubbleIcon, PlayIcon, CalendarIcon } from '@radix-ui/react-icons'
import { Button, Skeleton } from '@radix-ui/themes'
import { showEpisodeDetailModal, ShowPodcastDetailModal, toast } from '@/utils'
import { usePlayer } from '@/hooks'
import { PlayerEpisodeInfoType } from '@/utils/player'
import { useNavigate } from 'react-router-dom'
import { CONSTANT } from '@/types/constant'

type IProps = {
  data: any
  loading: boolean
}

const EditorRecommended: React.FC<IProps> = ({ data, loading }) => {
  const navigateTo = useNavigate()
  const player = usePlayer()

  return (
    <div className={styles['editor-recommended-layout']}>
      <h3>编辑精选</h3>

      <Skeleton loading={loading}>
        <div className={styles['editor-recommended-content']}>
          {data?.picks?.map((item: any) => {
            return (
              <div
                className={styles['editor-recommended-item']}
                key={item.episode.eid}
              >
                <div className={styles['editor-recommended-info']}>
                  <div className={styles['cover-box']}>
                    <ColorfulShadow
                      src={item.episode.podcast.image.picUrl}
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
                      <span>
                        <PlayIcon />
                        {item.episode.playCount}
                      </span>
                      <span>
                        <ChatBubbleIcon />
                        {item.episode.commentCount}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Skeleton>

      <div className={styles['extra-button']}>
        <Button
          size="2"
          variant="soft"
          color="gray"
          onClick={() => {
            navigateTo('/editorPickHistory')
          }}
        >
          <CalendarIcon />
          查看往日精选
        </Button>
      </div>
    </div>
  )
}

export default EditorRecommended
