import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { EpisodeType } from '@/types/episode'
import styles from './result.module.scss'
import { ColorfulShadow, Empty } from '@/components'
import { Spinner, Button } from '@radix-ui/themes'
import { search, searchType } from '@/api/search'
import { isEmpty } from 'lodash'
import { PlayerEpisodeInfoType } from '@/utils/player'
import { usePlayer } from '@/layouts/player'

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
              title={item.description}
            >
              <div className={styles['image']}>
                <ColorfulShadow
                  src={
                    item?.image ? item.image.picUrl : item.podcast.image.picUrl
                  }
                  curPointer
                  mask
                  onClick={() => {
                    const episodeInfo: PlayerEpisodeInfoType = {
                      title: item.title,
                      eid: item.eid,
                      pid: item.podcast.pid,
                      cover: item?.image
                        ? item.image.picUrl
                        : item.podcast.image.picUrl,
                      liked: item.isFavorited,
                    }

                    player.load(item.media.source.url, episodeInfo)
                    player.play()
                  }}
                />
              </div>

              <div
                className={styles['name']}
                title={item.title}
              >
                <span>{item.title}</span>
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
