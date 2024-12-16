import React, { useEffect, useState } from 'react'
import { ColorfulShadow } from '@/components'
import dayjs from 'dayjs'
import { SlBubble, SlEarphones } from 'react-icons/sl'
import { userType } from '@/types/user'
import { Storage } from '@/utils'
import { playedList } from '@/api/played'
import './index.modules.scss'

export const PlayedList: React.FC = () => {
  const [playedLists, setPlayedLists] = useState<any>([])

  const userInfo: userType = Storage.get('user_info')

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
    <div className="history-content">
      <h3>最近听过</h3>

      {playedLists.map((item: any) => (
        <div
          className="history-episode-item"
          key={item.eid}
        >
          <div className="left">
            <ColorfulShadow
              className="episode-cover"
              curPointer
              mask
              src={item.image.picUrl}
            />
          </div>
          <div className="right">
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
