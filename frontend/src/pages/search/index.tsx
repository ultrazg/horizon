import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Box,
  Button,
  Tabs,
  TextField,
  Badge,
  IconButton,
} from '@radix-ui/themes'
import {
  MagnifyingGlassIcon,
  Cross2Icon,
  TrashIcon,
} from '@radix-ui/react-icons'
import { search } from '@/api/search'
import { TabPodcast } from './components/tabPodcast'
import { TabEpisode } from './components/tabEpisode'
import { TabUser } from './components/tabUser'
import styles from './index.module.scss'
import { isEmpty } from 'lodash'
import { toast, Storage } from '@/utils'
import { ColorfulShadow } from '@/components'

export const Search: React.FC = () => {
  const location = useLocation()

  console.log('location', location)

  const [searchParams, setSearchParams] = useState({
    keyword: '',
    type: 'PODCAST',
  })
  const [data, setData] = useState<{ records: any[]; loadMoreKey: {} }>({
    records: [],
    loadMoreKey: {},
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const saveSearchHistory = (keyword: string) => {
    let history: string[] = Storage.get('search_history') || []
    history = Array.isArray(history) ? [...history] : []

    history = history.filter((item) => item !== keyword)

    if (history.length >= 20) {
      history.shift()
    }

    history.push(keyword)

    Storage.set('search_history', history.reverse())

    getSearchHistory()
  }

  const getSearchHistory = () => {
    let history = Storage.get('search_history')
    history = Array.isArray(history) ? [...history] : []

    setSearchHistory(() => history)
  }

  const clearSearchHistory = () => {
    Storage.remove('search_history')

    getSearchHistory()
  }

  const removeSearchHistoryKeyword = (keyword: string) => {
    let history: string[] = Storage.get('search_history')
    history = Array.isArray(history) ? [...history] : []

    history = history.filter((item) => item !== keyword)

    Storage.set('search_history', history)

    getSearchHistory()
  }

  /**
   * 搜索
   */
  const onSearch = (keyword?: string, loadMoreKey?: {}) => {
    setLoading(true)

    const params = {
      ...searchParams,
      keyword: keyword || searchParams.keyword,
      loadMoreKey,
    }

    search(params)
      .then((res) => {
        if (isEmpty(loadMoreKey)) {
          setData({
            records: res.data.data,
            loadMoreKey: res.data?.loadMoreKey,
          })
        } else {
          setData({
            records: [...data.records, ...res.data.data],
            loadMoreKey: res.data?.loadMoreKey,
          })
        }
      })
      .catch(() => {
        toast('搜索失败', { type: 'warn' })
      })
      .finally(() => {
        setLoading(false)
        saveSearchHistory(params.keyword)
      })
  }

  const onSearchHistoryClick = (keyword: string) => {
    setSearchParams({
      ...searchParams,
      keyword,
    })
    onSearch(keyword)
  }

  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({
      ...searchParams,
      keyword: e.target.value,
    })
  }

  const onTabChangeHandle = (value: string) => {
    setSearchParams({
      ...searchParams,
      type: value,
    })
  }

  useEffect(() => {
    if (searchParams.keyword) {
      onSearch()
    }
  }, [searchParams.type])

  useEffect(() => {
    getSearchHistory()
  }, [])

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
        <div className={styles['search-result-user']}>
          {Array.from({ length: 6 }).map((item: any) => (
            <div
              key={item}
              className={styles['avatar-container']}
            >
              <div className={styles['avatar']}>
                <ColorfulShadow
                  src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                  curPointer
                  circle
                />
              </div>
              <div className={styles['username']}>username</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles['search-category-title']}>
        <h3>节目</h3>
        <Button variant="ghost">查看更多</Button>
      </div>

      <div className={styles['search-result']}></div>

      <div className={styles['search-category-title']}>
        <h3>单集</h3>
        <Button variant="ghost">查看更多</Button>
      </div>

      <div className={styles['search-result']}></div>
      {/*</div>*/}
      {/*</div>*/}
    </div>
  )
}
