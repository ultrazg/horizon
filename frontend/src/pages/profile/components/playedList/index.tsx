import React, { useEffect, useState } from 'react'
import { ColorfulShadow } from '@/components'
import dayjs from 'dayjs'
import { SlBubble, SlEarphones } from 'react-icons/sl'
import { userType } from '@/types/user'
import { Storage } from '@/utils'
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
              onClick={() => {
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
            />
          </div>
          <div className={styles['right']}>
            <p>{item.title}</p>
            <p>{item.description}</p>
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
