import React, { useEffect, useState } from 'react'
import { Box, Button, Tabs, TextField } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { search } from '@/api/search'
import { TabPodcast } from './components/tabPodcast'
import { TabEpisode } from './components/tabEpisode'
import { TabUser } from './components/tabUser'
import './index.modules.scss'

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    type: 'PODCAST',
  })
  const [data, setData] = useState({
    records: [],
    loadMoreKey: {},
  })

  /**
   * 搜索
   */
  const onSearch = () => {
    search(searchParams)
      .then((res) =>
        setData({
          records: res.data.data,
          loadMoreKey: res.data?.loadMoreKey,
        }),
      )
      .catch((err) => {
        console.error(err)
      })
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

  return (
    <div className="search-layout">
      <h3>搜索</h3>

      <div className="search-content">
        <div className="search-input">
          <div className="left">
            <TextField.Root
              size="3"
              placeholder="输入关键字"
              onChange={onChangeHandle}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon
                  height="16"
                  width="16"
                />
              </TextField.Slot>
            </TextField.Root>
          </div>

          <div className="right">
            <Button
              size="3"
              onClick={() => {
                onSearch()
              }}
              disabled={!searchParams.keyword}
            >
              搜索
            </Button>
          </div>
        </div>

        <div className="search-result">
          <Tabs.Root
            value={searchParams.type}
            onValueChange={onTabChangeHandle}
          >
            <Tabs.List size="2">
              <Tabs.Trigger value="PODCAST">节目</Tabs.Trigger>
              <Tabs.Trigger value="EPISODE">单集</Tabs.Trigger>
              <Tabs.Trigger value="USER">用户</Tabs.Trigger>
            </Tabs.List>

            <Box pt="3">
              <Tabs.Content value="PODCAST">
                <TabPodcast
                  data={data}
                  onLoadMore={() => {
                    console.log('onLoadMore')
                  }}
                />
              </Tabs.Content>

              <Tabs.Content value="EPISODE">
                <TabEpisode
                  data={data}
                  onLoadMore={() => {
                    console.log('more')
                  }}
                />
              </Tabs.Content>

              <Tabs.Content value="USER">
                <TabUser
                  data={data}
                  onLoadMore={() => {
                    console.log('more')
                  }}
                />
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </div>
      </div>
    </div>
  )
}
