import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import {
  ColorfulShadow,
  FinishedTag,
  PayEpisodeTag,
  PlayedTag,
  OwnedEpisodeTag,
} from '@/components'
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
  fetchPrivateMediaUrl,
} from '@/utils'
import { usePlayer } from '@/hooks'
import { PlayerEpisodeInfoType } from '@/utils/player'

const TabEpisode: React.FC = () => {
  const [lists, setLists] = useState<EpisodeType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const player = usePlayer()

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
            toast('取消收藏成功', { type: 'success' })
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
    <div className={styles['favorites-episode-layout']}>
      <Spinner loading={loading}>
        {lists.map((item) => (
          <div
            className={styles['favorites-episode-item']}
            key={item.eid}
          >
            <div className={styles['left']}>
              <ColorfulShadow
                className={styles['episode-cover']}
                curPointer
                mask
                src={item.image ? item.image.picUrl : item.podcast.image.picUrl}
                onPlay={async () => {
                  const episodeInfo: PlayerEpisodeInfoType = {
                    title: item.title,
                    eid: item.eid,
                    pid: item.podcast.pid,
                    cover: item?.image
                      ? item.image.picUrl
                      : item.podcast.image.picUrl,
                    liked: item.isFavorited,
                  }
                  let url: string = ''

                  if (item.payType === 'FREE') {
                    url = item.media.source.url
                  } else if (item.payType === 'PAY_EPISODE' && item.isOwned) {
                    url = await fetchPrivateMediaUrl(item.eid)
                  } else if (
                    item.payType === 'PAY_EPISODE' &&
                    !item.isOwned &&
                    item.trial?.segment
                  ) {
                    url = item.trial?.segment
                    toast('正在播放试听内容', {
                      type: 'info',
                      duration: 5000,
                    })
                  } else {
                    toast('播放失败', {
                      type: 'warn',
                    })
                    return
                  }

                  player.load(url, episodeInfo)
                  player.play()
                }}
                onAddToPlaylist={async () => {
                  const episodeInfo: PlayerEpisodeInfoType = {
                    title: item.title,
                    eid: item.eid,
                    pid: item.podcast.pid,
                    cover: item?.image
                      ? item.image.picUrl
                      : item.podcast.image.picUrl,
                    liked: item.isFavorited,
                  }
                  let url: string = ''

                  if (item.payType === 'FREE') {
                    url = item.media.source.url
                  } else if (item.payType === 'PAY_EPISODE' && item.isOwned) {
                    url = await fetchPrivateMediaUrl(item.eid)
                  } else if (
                    item.payType === 'PAY_EPISODE' &&
                    !item.isOwned &&
                    item.trial?.segment
                  ) {
                    url = item.trial?.segment
                  } else {
                    toast('添加失败', { type: 'warn' })
                    return
                  }

                  const added = player.addToPlaylist(url, episodeInfo)
                  toast(added ? '已添加到播放列表' : '已在播放列表中')
                }}
              />
            </div>
            <div className={styles['right']}>
              <p
                title={item.title}
                onClick={() => {
                  showEpisodeDetailModal(item.eid)
                }}
              >
                {item.isOwned && <OwnedEpisodeTag />}
                {item.payType === 'PAY_EPISODE' && !item.isOwned && (
                  <PayEpisodeTag />
                )}
                {item.title}
              </p>
              <p
                title={item.description}
                onClick={() => {
                  showEpisodeDetailModal(item.eid)
                }}
              >
                {item.description}
              </p>
              <p>
                {item.isPlayed && !item.isFinished && (
                  <span style={{ marginRight: '0.5rem' }}>
                    <PlayedTag />
                  </span>
                )}
                {item.isFinished && (
                  <span style={{ marginRight: '0.5rem' }}>
                    <FinishedTag />
                  </span>
                )}
                <span>
                  {Math.floor(item.duration / 60)}分钟 ·{' '}
                  {dayjs(item.pubDate).format('YYYY/MM/DD')}
                </span>
                <span className={styles['favorites-episode-item-info']}>
                  <SlEarphones />
                  {item.playCount}
                  <SlBubble />
                  {item.commentCount}
                </span>
                <span className={styles['delete-button']}>
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
