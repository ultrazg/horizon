import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { EpisodeType } from '@/types/episode'
import styles from './result.module.scss'
import {
  ColorfulShadow,
  Empty,
  OwnedEpisodeTag,
  PayEpisodeTag,
} from '@/components'
import { Spinner, Button } from '@radix-ui/themes'
import { search, searchType } from '@/api/search'
import { isEmpty } from 'lodash'
import { PlayerEpisodeInfoType } from '@/utils/player'
import { usePlayer } from '@/layouts/player'
import { fetchPrivateMediaUrl, toast } from '@/utils'

/**
 * 单集搜索结果页
 * @constructor
 */
export const ResultEpisode: React.FC = () => {
  const { keyword } = useLocation().state
  const player = usePlayer()
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<{
    records: EpisodeType[]
    loadMoreKey: any
  }>({
    records: [],
    loadMoreKey: {},
  })

  const onSearch = (loadMore: boolean) => {
    setLoading(true)

    const params: searchType = {
      keyword,
      type: 'EPISODE',
    }

    if (!isEmpty(data.loadMoreKey)) {
      params.loadMoreKey = data.loadMoreKey
    }

    search(params)
      .then((res) => {
        console.log(res)
        if (loadMore) {
          setData({
            records: [...data.records, ...res.data.data],
            loadMoreKey: res.data?.loadMoreKey || {},
          })
        } else {
          setData({
            records: res.data.data,
            loadMoreKey: res.data?.loadMoreKey || {},
          })
        }
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    onSearch(false)

    return () => {
      setLoading(false)
      setData({
        records: [],
        loadMoreKey: {},
      })
    }
  }, [keyword])

  return (
    <>
      <h3 className={styles['title']}>搜索单集“{keyword}”</h3>

      <Spinner loading={loading}>
        {data.records.length === 0 && <Empty />}

        <div className={styles['search-result-wrapper']}>
          {data.records.map((item) => (
            <div
              key={item.eid}
              className={styles['search-result-item']}
              title={item.title}
            >
              <div className={styles['image']}>
                <ColorfulShadow
                  src={
                    item?.image ? item.image.picUrl : item.podcast.image.picUrl
                  }
                  curPointer
                  mask
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

              <div
                className={styles['name']}
                title={item.title}
              >
                <span>
                  {item.isOwned && <OwnedEpisodeTag />}
                  {item.payType === 'PAY_EPISODE' && !item.isOwned && (
                    <PayEpisodeTag />
                  )}
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        {!isEmpty(data.loadMoreKey) && (
          <div className={styles['loadMoreButton']}>
            <Button
              variant="soft"
              onClick={() => {
                onSearch(true)
              }}
              color="gray"
            >
              加载更多
            </Button>
          </div>
        )}
      </Spinner>
    </>
  )
}
