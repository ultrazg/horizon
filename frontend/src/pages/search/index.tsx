import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Spinner } from '@radix-ui/themes'
import { search, type searchType } from '@/api/search'
import styles from './index.module.scss'
import { toast } from '@/utils'
import { ColorfulShadow, ProfileModal, Empty } from '@/components'
import { baseUserType } from '@/types/user'
import { EpisodeType } from '@/types/episode'
import { PodcastType } from '@/types/podcast'
import { PlayerEpisodeInfoType } from '@/utils/player'
import { usePlayer } from '@/hooks'

export const Search: React.FC = () => {
  const location = useLocation()
  const keyword = location.state.keyword
  const navigateTo = useNavigate()
  const player = usePlayer()
  const [podcastResults, setPodcastResults] = useState<{
    records: PodcastType[]
    loading: boolean
  }>({
    records: [],
    loading: false,
  })
  const [episodeResults, setEpisodeResults] = useState<{
    records: EpisodeType[]
    loading: boolean
  }>({
    records: [],
    loading: false,
  })
  const [userResults, setUserResults] = useState<{
    records: baseUserType[]
    loading: boolean
  }>({
    records: [],
    loading: false,
  })
  const [profileModal, setProfileModal] = useState<{
    open: boolean
    uid: string
  }>({
    open: false,
    uid: '',
  })

  const goPodcastDetail = (pid: string) => {
    navigateTo('/podcast/detail', {
      state: {
        pid,
      },
    })
  }

  /**
   * 搜索
   */
  const onSearch = async (
    keyword: string,
    type: 'PODCAST' | 'EPISODE' | 'USER',
    loadMoreKey?: {},
  ) => {
    const params: searchType = {
      type,
      keyword,
      loadMoreKey,
    }

    return await search(params)
  }

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  useEffect(() => {
    const onSearchEpisode = async () => {
      setEpisodeResults({
        records: [],
        loading: true,
      })

      await onSearch(keyword, 'EPISODE')
        .then((res) => {
          if (res.data.data.length > 6) {
            setEpisodeResults({
              records: res.data.data.slice(0, 6),
              loading: false,
            })
          } else {
            setEpisodeResults({
              records: res.data.data,
              loading: false,
            })
          }
        })
        .catch(() => {
          toast('搜索单集失败', { type: 'warn' })
        })
    }

    const onSearchPodcast = async () => {
      setPodcastResults({
        records: [],
        loading: true,
      })

      await onSearch(keyword, 'PODCAST')
        .then((res) => {
          if (res.data.data.length > 6) {
            setPodcastResults({
              records: res.data.data.slice(0, 6),
              loading: false,
            })
          } else {
            setPodcastResults({
              records: res.data.data,
              loading: false,
            })
          }
        })
        .catch(() => {
          toast('搜索节目失败', { type: 'warn' })
        })
    }

    const onSearchUser = async () => {
      setUserResults({
        records: [],
        loading: true,
      })

      await onSearch(keyword, 'USER')
        .then((res) => {
          if (res.data.data.length > 6) {
            setUserResults({
              records: res.data.data.slice(0, 6),
              loading: false,
            })
          } else {
            setUserResults({
              records: res.data.data,
              loading: false,
            })
          }
        })
        .catch(() => {
          toast('搜索用户失败', { type: 'warn' })
        })
    }

    const fetchData = async () => {
      await onSearchUser()
      await delay(1000)
      await onSearchPodcast()
      await delay(1000)
      await onSearchEpisode()
    }

    fetchData()
  }, [keyword])

  return (
    <div className={styles['search-layout']}>
      <div className={styles['search-category-title']}>
        <h3>用户</h3>
        {userResults.records.length >= 6 && (
          <Button
            variant="ghost"
            onClick={() => {
              navigateTo('/search/user', {
                state: {
                  keyword,
                },
              })
            }}
          >
            查看更多
          </Button>
        )}
      </div>

      <div className={styles['search-result']}>
        <Spinner loading={userResults.loading}>
          <div className={styles['search-result-wrapper']}>
            {userResults.records.length === 0 && <Empty />}

            {userResults.records.map((item) => (
              <div
                key={item.uid}
                className={styles['image-container']}
                title={item.nickname}
                onClick={() => {
                  setProfileModal({
                    open: true,
                    uid: item.uid,
                  })
                }}
              >
                <div className={styles['image']}>
                  <ColorfulShadow
                    src={item.avatar.picture.picUrl}
                    curPointer
                    circle
                  />
                </div>
                <div className={styles['name']}>{item.nickname}</div>
              </div>
            ))}
          </div>
        </Spinner>
      </div>

      <div className={styles['search-category-title']}>
        <h3>节目</h3>
        {podcastResults.records.length >= 6 && (
          <Button
            variant="ghost"
            onClick={() => {
              navigateTo('/search/podcast', {
                state: {
                  keyword,
                },
              })
            }}
          >
            查看更多
          </Button>
        )}
      </div>

      <div className={styles['search-result']}>
        <Spinner loading={podcastResults.loading}>
          <div className={styles['search-result-wrapper']}>
            {podcastResults.records.length === 0 && <Empty />}

            {podcastResults.records.map((item) => (
              <div
                key={item.pid}
                className={styles['image-container']}
                title={item.title}
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
                <div className={styles['name']}>{item.title}</div>
              </div>
            ))}
          </div>
        </Spinner>
      </div>

      <div className={styles['search-category-title']}>
        <h3>单集</h3>
        {episodeResults.records.length >= 6 && (
          <Button
            variant="ghost"
            onClick={() => {
              navigateTo('/search/episode', {
                state: {
                  keyword,
                },
              })
            }}
          >
            查看更多
          </Button>
        )}
      </div>

      <div className={styles['search-result']}>
        <Spinner loading={episodeResults.loading}>
          <div className={styles['search-result-wrapper']}>
            {episodeResults.records.length === 0 && <Empty />}

            {episodeResults.records.map((item) => (
              <div
                key={item.eid}
                className={styles['image-container']}
                title={item.title}
              >
                <div className={styles['image']}>
                  <ColorfulShadow
                    src={
                      item?.image
                        ? item.image.picUrl
                        : item.podcast.image.picUrl
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
                <div className={styles['name']}>{item.title}</div>
              </div>
            ))}
          </div>
        </Spinner>
      </div>

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
    </div>
  )
}
