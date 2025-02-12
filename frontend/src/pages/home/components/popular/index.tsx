import React from 'react'
import { ColorfulShadow } from '@/components'
import { QuoteIcon, UpdateIcon } from '@radix-ui/react-icons'
import { Button, Skeleton } from '@radix-ui/themes'
import './index.modules.scss'
import { PopularType, TargetType } from '@/pages/home'
import { showEpisodeDetailModal } from '@/utils'
import { usePlayer } from '@/hooks'
import { PlayerEpisodeInfoType } from '@/utils/player'

type IProps = {
  data: PopularType
  loading: boolean
  onRefresh: () => void
  onDetail: (pid: string) => void
}

/**
 * 发现-大家都在听
 * @constructor
 */
const PopularPart: React.FC<IProps> = ({
  data,
  loading,
  onRefresh,
  onDetail,
}) => {
  const player = usePlayer()

  return (
    <div className="popular-layout">
      <h3>大家都在听</h3>

      <Skeleton loading={loading}>
        <div className="popular-content">
          {data?.target?.map((item: TargetType) => (
            <div
              className="popular-item"
              key={item.episode.eid}
            >
              <div className="popular-info">
                <div className="cover-box">
                  <ColorfulShadow
                    src={
                      item.episode?.image
                        ? item.episode.image.picUrl
                        : item.episode.podcast.image.picUrl
                    }
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
                    title={item.episode.title}
                    onClick={() => {
                      showEpisodeDetailModal(item.episode.eid)
                    }}
                  >
                    {item.episode.title}
                  </p>
                  <p
                    onClick={() => {
                      console.log(player.duration)
                    }}
                  >
                    <QuoteIcon />
                    {item.recommendation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Skeleton>

      <div className="reload-button">
        <Button
          size="1"
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
