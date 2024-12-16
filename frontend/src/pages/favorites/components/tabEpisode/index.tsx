import React, { useEffect, useState } from 'react'
import './index.modules.scss'
import { ColorfulShadow } from '@/components'
import { SlBubble, SlEarphones } from 'react-icons/sl'
import { favoriteEpisodeList } from '@/api/favorite'
import { EpisodeType } from '@/types/episode'
import { Spinner } from '@radix-ui/themes'
import dayjs from 'dayjs'

const TabEpisode: React.FC = () => {
  const [lists, setLists] = useState<EpisodeType[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * 获取收藏单集列表数据
   */
  const getLists = () => {
    setLoading(true)
    favoriteEpisodeList()
      .then((res) => setLists(res.data.data))
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getLists()
  }, [])

  return (
    <div className="favorites-episode-layout">
      <Spinner loading={loading}>
        {lists.map((item) => (
          <div
            className="favorites-episode-item"
            key={item.eid}
          >
            <div className="left">
              <ColorfulShadow
                className="episode-cover"
                curPointer
                mask
                src={item.image ? item.image.picUrl : item.podcast.image.picUrl}
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
      </Spinner>
    </div>
  )
}

export default TabEpisode
