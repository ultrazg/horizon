import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Box,
  Button,
  Tabs,
  TextField,
  Badge,
  IconButton,
  Spinner,
} from '@radix-ui/themes'
import {
  MagnifyingGlassIcon,
  Cross2Icon,
  TrashIcon,
} from '@radix-ui/react-icons'
import { search, type searchType } from '@/api/search'
import { TabPodcast } from './components/tabPodcast'
import { TabEpisode } from './components/tabEpisode'
import { TabUser } from './components/tabUser'
import styles from './index.module.scss'
import { isEmpty } from 'lodash'
import { toast, Storage } from '@/utils'
import { ColorfulShadow, ProfileModal } from '@/components'
import { baseUserType } from '@/types/user'
import { EpisodeType } from '@/types/episode'
import { PodcastType } from '@/types/podcast'
import { PlayerEpisodeInfoType } from '@/utils/player'
import { usePlayer } from '@/hooks'

export const Search: React.FC = () => {
  const location = useLocation()
  const keyword = location.state.keyword
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
  // const [searchHistory, setSearchHistory] = useState<string[]>([])

  // const saveSearchHistory = (keyword: string) => {
  //   let history: string[] = Storage.get('search_history') || []
  //   history = Array.isArray(history) ? [...history] : []
  //
  //   history = history.filter((item) => item !== keyword)
  //
  //   if (history.length >= 20) {
  //     history.shift()
  //   }
  //
  //   history.push(keyword)
  //
  //   Storage.set('search_history', history.reverse())
  //
  //   getSearchHistory()
  // }

  // const getSearchHistory = () => {
  //   let history = Storage.get('search_history')
  //   history = Array.isArray(history) ? [...history] : []
  //
  //   setSearchHistory(() => history)
  // }

  // const clearSearchHistory = () => {
  //   Storage.remove('search_history')
  //
  //   getSearchHistory()
  // }

  // const removeSearchHistoryKeyword = (keyword: string) => {
  //   let history: string[] = Storage.get('search_history')
  //   history = Array.isArray(history) ? [...history] : []
  //
  //   history = history.filter((item) => item !== keyword)
  //
  //   Storage.set('search_history', history)
  //
  //   getSearchHistory()
  // }

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

    // search(params)
    //   .then((res) => {
    //     if (isEmpty(loadMoreKey)) {
    //       setData({
    //         records: res.data.data,
    //         loadMoreKey: res.data?.loadMoreKey,
    //       })
    //     } else {
    //       setData({
    //         records: [...data.records, ...res.data.data],
    //         loadMoreKey: res.data?.loadMoreKey,
    //       })
    //     }
    //   })
    //   .catch(() => {
    //     toast('搜索失败', { type: 'warn' })
    //   })
    //   .finally(() => {
    //     // saveSearchHistory(params.keyword)
    //   })
  }

  // const onSearchHistoryClick = (keyword: string) => {
  //   setSearchParams({
  //     ...searchParams,
  //     keyword,
  //   })
  //   onSearch(keyword)
  // }

  // const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchParams({
  //     ...searchParams,
  //     keyword: e.target.value,
  //   })
  // }

  // const onTabChangeHandle = (value: string) => {
  //   setSearchParams({
  //     ...searchParams,
  //     type: value,
  //   })
  // }

  // useEffect(() => {
  //   if (searchParams.keyword) {
  //     onSearch()
  //   }
  // }, [searchParams.type])

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

    onSearchUser()
    onSearchPodcast()
    onSearchEpisode()
  }, [keyword])

  // useEffect(() => {
  //   getSearchHistory()
  // }, [])

  return (
    <div className={styles['search-layout']}>
      {/*<h3>搜索</h3>*/}

      {/*<div className={styles['search-content']}>*/}
      {/*<div className={styles['search-input']}>*/}
      {/*  <div className={styles['left']}>*/}
      {/*    <TextField.Root*/}
      {/*      size="3"*/}
      {/*      placeholder="输入关键字"*/}
      {/*      onChange={onChangeHandle}*/}
      {/*      value={searchParams.keyword}*/}
      {/*    >*/}
      {/*      <TextField.Slot>*/}
      {/*        <MagnifyingGlassIcon*/}
      {/*          height="16"*/}
      {/*          width="16"*/}
      {/*        />*/}
      {/*      </TextField.Slot>*/}
      {/*    </TextField.Root>*/}
      {/*  </div>*/}

      {/*  <div className={styles['right']}>*/}
      {/*    <Button*/}
      {/*      size="3"*/}
      {/*      onClick={() => {*/}
      {/*        onSearch()*/}
      {/*      }}*/}
      {/*      disabled={!searchParams.keyword}*/}
      {/*      loading={loading}*/}
      {/*    >*/}
      {/*      搜索*/}
      {/*    </Button>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*{!isEmpty(searchHistory) && (*/}
      {/*  <div className={styles['search_history']}>*/}
      {/*    <div className={styles['search_history_title']}>*/}
      {/*      <span>搜索历史</span>*/}

      {/*      <IconButton*/}
      {/*        size="1"*/}
      {/*        color="gray"*/}
      {/*        variant="ghost"*/}
      {/*        style={{ marginLeft: 4 }}*/}
      {/*        onClick={() => clearSearchHistory()}*/}
      {/*      >*/}
      {/*        <TrashIcon*/}
      {/*          width="14"*/}
      {/*          height="14"*/}
      {/*        />*/}
      {/*      </IconButton>*/}
      {/*    </div>*/}
      {/*    {searchHistory.map((item) => {*/}
      {/*      return (*/}
      {/*        <Badge*/}
      {/*          key={item}*/}
      {/*          color="gray"*/}
      {/*          style={{ marginRight: 4, cursor: 'pointer' }}*/}
      {/*        >*/}
      {/*          <span onClick={() => onSearchHistoryClick(item)}>{item}</span>*/}

      {/*          <IconButton*/}
      {/*            size="1"*/}
      {/*            variant="ghost"*/}
      {/*            onClick={() => removeSearchHistoryKeyword(item)}*/}
      {/*          >*/}
      {/*            <Cross2Icon*/}
      {/*              width="14"*/}
      {/*              height="14"*/}
      {/*            />*/}
      {/*          </IconButton>*/}
      {/*        </Badge>*/}
      {/*      )*/}
      {/*    })}*/}
      {/*  </div>*/}
      {/*)}*/}

      {/*<div className={styles['search-result']}>*/}
      {/*<Tabs.Root*/}
      {/*  value={searchParams.type}*/}
      {/*  onValueChange={onTabChangeHandle}*/}
      {/*>*/}
      {/*  <Tabs.List size="2">*/}
      {/*    <Tabs.Trigger value="PODCAST">节目</Tabs.Trigger>*/}
      {/*    <Tabs.Trigger value="EPISODE">单集</Tabs.Trigger>*/}
      {/*    <Tabs.Trigger value="USER">用户</Tabs.Trigger>*/}
      {/*  </Tabs.List>*/}

      {/*  <Box pt="3">*/}
      {/*    <Tabs.Content value="PODCAST">*/}
      {/*      <TabPodcast*/}
      {/*        data={data}*/}
      {/*        onLoadMore={(loadMoreKey) => {*/}
      {/*          onSearch('', loadMoreKey)*/}
      {/*        }}*/}
      {/*        onRefresh={() => {*/}
      {/*          onSearch()*/}
      {/*        }}*/}
      {/*        loading={loading}*/}
      {/*      />*/}
      {/*    </Tabs.Content>*/}

      {/*    <Tabs.Content value="EPISODE">*/}
      {/*      <TabEpisode*/}
      {/*        data={data}*/}
      {/*        onLoadMore={(loadMoreKey) => {*/}
      {/*          onSearch('', loadMoreKey)*/}
      {/*        }}*/}
      {/*        loading={loading}*/}
      {/*      />*/}
      {/*    </Tabs.Content>*/}

      {/*    <Tabs.Content value="USER">*/}
      {/*      <TabUser*/}
      {/*        data={data}*/}
      {/*        onLoadMore={(loadMoreKey) => {*/}
      {/*          onSearch('', loadMoreKey)*/}
      {/*        }}*/}
      {/*        loading={loading}*/}
      {/*      />*/}
      {/*    </Tabs.Content>*/}
      {/*  </Box>*/}
      {/*</Tabs.Root>*/}
      <div className={styles['search-category-title']}>
        <h3>用户</h3>
        <Button variant="ghost">查看更多</Button>
      </div>

      <div className={styles['search-result']}>
        <Spinner loading={userResults.loading}>
          <div className={styles['search-result-wrapper']}>
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
        <Button variant="ghost">查看更多</Button>
      </div>

      <div className={styles['search-result']}>
        <Spinner loading={podcastResults.loading}>
          <div className={styles['search-result-wrapper']}>
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
        <Button variant="ghost">查看更多</Button>
      </div>

      <div className={styles['search-result']}>
        <Spinner loading={episodeResults.loading}>
          <div className={styles['search-result-wrapper']}>
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
      {/*</div>*/}
      {/*</div>*/}

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
