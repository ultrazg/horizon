import React, { useEffect, useState } from 'react'
import styles from './result.module.scss'
import { useLocation } from 'react-router-dom'
import { ColorfulShadow, Empty, ProfileModal } from '@/components'
import { search, type searchType } from '@/api/search'
import { baseUserType } from '@/types/user'
import { Button, Spinner } from '@radix-ui/themes'
import { isEmpty } from 'lodash'

/**
 * 用户搜索结果页
 * @constructor
 */
export const ResultUser: React.FC = () => {
  const { keyword } = useLocation().state
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<{
    records: baseUserType[]
    loadMoreKey: any
  }>({
    records: [],
    loadMoreKey: {},
  })
  const [profileModal, setProfileModal] = useState<{
    open: boolean
    uid: string
  }>({
    open: false,
    uid: '',
  })

  const onSearch = (loadMore: boolean) => {
    setLoading(true)

    const params: searchType = {
      keyword,
      type: 'USER',
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
      <h3 className={styles['title']}>搜索用户“{keyword}”</h3>

      <Spinner loading={loading}>
        {data.records.length === 0 && <Empty />}

        <div className={styles['search-result-wrapper']}>
          {data.records.map((item) => (
            <div
              key={item.uid}
              className={styles['search-result-item']}
              title={item.nickname}
            >
              <div className={styles['image']}>
                <ColorfulShadow
                  src={item.avatar.picture.picUrl}
                  curPointer
                  circle
                  onClick={() => {
                    setProfileModal({
                      open: true,
                      uid: item.uid,
                    })
                  }}
                />
              </div>

              <div className={styles['name']}>
                <span>{item.nickname}</span>
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

      <ProfileModal
        uid={profileModal.uid}
        open={profileModal.open}
        onClose={() => {
          setProfileModal({
            open: false,
            uid: '',
          })
        }}
      />
    </>
  )
}
