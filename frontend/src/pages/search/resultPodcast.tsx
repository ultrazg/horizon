import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { search, searchType } from '@/api/search'
import { isEmpty } from 'lodash'
import styles from '@/pages/search/result.module.scss'
import { ColorfulShadow, Empty } from '@/components'
import { Button, Spinner } from '@radix-ui/themes'
import { PodcastType } from '@/types/podcast'

/**
 * 单集搜索结果页
 * @constructor
 */
export const ResultPodcast: React.FC = () => {
  const { keyword } = useLocation().state
  const navigateTo = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<{
    records: PodcastType[]
    loadMoreKey: any
  }>({
    records: [],
    loadMoreKey: {},
  })

  const goPodcastDetail = (pid: string) => {
    navigateTo('/podcast/detail', {
      state: {
        pid,
      },
    })
  }

  const onSearch = (loadMore: boolean) => {
    setLoading(true)

    const params: searchType = {
      keyword,
      type: 'PODCAST',
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
      <h3 className={styles['title']}>搜索节目“{keyword}”</h3>

      <Spinner loading={loading}>
        {data.records.length === 0 && <Empty />}

        <div className={styles['search-result-wrapper']}>
          {data.records.map((item) => (
            <div
              key={item.pid}
              className={styles['search-result-item']}
              title={item.description}
            >
              <div className={styles['image']}>
                <ColorfulShadow
                  src={item.image.picUrl}
                  curPointer
                  onClick={() => {
                    goPodcastDetail(item.pid)
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
