import React from 'react'
import './index.modules.scss'
import { ColorfulShadow } from '@/components'
import { ChatBubbleIcon, PlayIcon } from '@radix-ui/react-icons'
import { Skeleton } from '@radix-ui/themes'
import { showEpisodeDetailModal } from '@/utils'
import { usePlayer } from '@/hooks'
import { PlayerEpisodeInfoType } from '@/utils/player'

type IProps = {
  data: any
  loading: boolean
  onDetail: (pid: string) => void
}

const EditorRecommended: React.FC<IProps> = ({ data, loading, onDetail }) => {
  const player = usePlayer()

  const onPlayHandle = (url: string, episodeInfo: PlayerEpisodeInfoType) => {
    player.load(url, episodeInfo)
    player.play()
  }

  return (
    <div className="editor-recommended-layout">
      <h3>编辑精选</h3>

      <Skeleton loading={loading}>
        <div className="editor-recommended-content">
          {data?.picks?.map((item: any) => {
            return (
              <div
                className="editor-recommended-item"
                key={item.episode.eid}
                title={`@${item.comment.author.nickname}：\r\n${item.comment ? item.comment.text : item.recommendation}`}
              >
                <div className="editor-recommended-info">
                  <div className="cover-box">
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

                        onPlayHandle(item.episode.media.source.url, episodeInfo)
                      }}
                    />
                  </div>
                  <div className="info-box">
                    <p
                      onClick={() => {
                        onDetail(item.episode.podcast.pid)
                      }}
                    >
                      {item.episode.podcast.title}
                    </p>
                    <p
                      onClick={() => {
                        showEpisodeDetailModal(item.episode.eid)
                      }}
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
    </div>
  )
}

export default EditorRecommended
