import React, { useEffect, useState } from 'react'
import './index.modules.scss'
import { ColorfulShadow } from '@/components'
import { SlBubble, SlEarphones } from 'react-icons/sl'
import { favoriteEpisodeList, favoriteEpisodeUpdate } from '@/api/favorite'
import { EpisodeType } from '@/types/episode'
import { IconButton, Spinner } from '@radix-ui/themes'
import { TrashIcon } from '@radix-ui/react-icons'
import dayjs from 'dayjs'
import {
  DialogType,
  showEpisodeDetailModal,
  ShowMessageDialog,
  toast,
} from '@/utils'

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

  /**
   * 更新收藏单集列表数据
   * @param eid 单集 eid
   * @param favorited 是否收藏
   */
  const onUpdate = (eid: string, favorited: boolean) => {
    ShowMessageDialog(
      DialogType.QUESTION,
      '提示',
      '确定要取消收藏这条单集吗？',
    ).then((res) => {
      if (res === 'Yes' || res === '是') {
        const params = {
          eid,
          favorited,
        }

        favoriteEpisodeUpdate(params)
          .then(() => {
            toast('取消收藏成功')
            getLists()
          })
          .catch(() => {
            toast('操作失败')
          })
      }
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
            <div
              className="right"
              onClick={() => {
                showEpisodeDetailModal(item.eid)
              }}
            >
              <p title={item.title}>{item.title}</p>
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
                <span>
                  <IconButton
                    size="1"
                    color="red"
                    variant="soft"
                    onClick={() => {
                      onUpdate(item.eid, !item.isFavorited)
                    }}
                  >
                    <TrashIcon />
                  </IconButton>
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
