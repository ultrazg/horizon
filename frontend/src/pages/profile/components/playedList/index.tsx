import React, { useEffect, useState } from 'react'
import {
  ColorfulShadow,
  FinishedTag,
  PayEpisodeTag,
  PlayedTag,
} from '@/components'
import dayjs from 'dayjs'
import { SlBubble, SlEarphones } from 'react-icons/sl'
import { userType } from '@/types/user'
import { Storage, toast } from '@/utils'
import { playedList } from '@/api/played'
import styles from './index.module.scss'
import { usePlayer } from '@/hooks'
import { PlayerEpisodeInfoType } from '@/utils/player'
import { EpisodeType } from '@/types/episode'

export const PlayedList: React.FC = () => {
  const [playedLists, setPlayedLists] = useState<EpisodeType[]>([])
  const userInfo: userType = Storage.get('user_info')
  const player = usePlayer()

  /**
   * 获取最近听过列表
   */
  const onGetPlayedList = () => {
    const params = {
      uid: userInfo.uid,
    }

    playedList(params)
      .then((res) => setPlayedLists(res.data.data))
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    onGetPlayedList()
  }, [])

  return (
    <div className={styles['history-content']}>
      <h3>最近听过</h3>

      {playedLists.map((item) => (
        <div
          className={styles['history-episode-item']}
          key={item.eid}
        >
          <div className={styles['left']}>
            <ColorfulShadow
              className={styles['episode-cover']}
              curPointer
              mask
              src={item?.image ? item.image.picUrl : item.podcast.image.picUrl}
              onPlay={() => {
                const episodeInfo: PlayerEpisodeInfoType = {
                  eid: item.eid,
                  pid: item.podcast.pid,
                  cover: item?.image
                    ? item.image.picUrl
                    : item.podcast.image.picUrl,
                  title: item.title,
                  liked: item.isFavorited,
                }

                player.load(item.media.source.url, episodeInfo)
                player.play()
              }}
              onAddToPlaylist={() => {
                const episodeInfo: PlayerEpisodeInfoType = {
                  eid: item.eid,
                  pid: item.podcast.pid,
                  cover: item?.image
                    ? item.image.picUrl
                    : item.podcast.image.picUrl,
                  title: item.title,
                  liked: item.isFavorited,
                }

                const added = player.addToPlaylist(
                  item.media.source.url,
                  episodeInfo,
                )
                toast(added ? '已添加到播放列表' : '已在播放列表中')
              }}
            />
          </div>
          <div className={styles['right']}>
            <p>
              {item.payType === 'PAY_EPISODE' && <PayEpisodeTag />}
              {item.title}
            </p>
            <p>{item.description}</p>
            <p>
              {item.isPlayed && !item.isFinished && <PlayedTag />}
              {item.isFinished && <FinishedTag />}
              <span>
                {Math.floor(item.duration / 60)}分钟 ·{' '}
                {dayjs(item.pubDate).format('YYYY/MM/DD')}
              </span>
              <span>
                <SlEarphones />
                {item.playCount}
              </span>
              <span>
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
