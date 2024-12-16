import React, { useEffect, useState } from 'react'
import { Box, Button, Tabs, TextField, Avatar } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { SlEarphones, SlBubble } from 'react-icons/sl'
import { ColorfulShadow, ProfileModal } from '@/components'
import { search } from '@/api/search'
import { PodcastType } from '@/types/podcast'
import { EpisodeType } from '@/types/episode'
import { TabPodcast } from './components/tabPodcast'
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
  const [profileModal, setProfileModal] = useState<{
    open: boolean
    uid: string
  }>({
    open: false,
    uid: '',
  })
  const [currentTab, setCurrentTab] = useState('PODCAST')

  /**
   * 搜索
   */
  const onSearch = () => {
    search(searchParams)
      .then((res) =>
        setData({
          records: res.data.data,
          loadMoreKey: res.data.loadMoreKey,
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
    setCurrentTab(value)
  }

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
            value={currentTab}
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
                <div className="search-result-episode-layout">
                  <div className="search-result-episode-item">
                    <div className="left">
                      <ColorfulShadow
                        className="episode-cover"
                        curPointer
                        mask
                        src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                      />
                    </div>
                    <div className="right">
                      <p>小米SU7营销复盘：你所知道的为什么都是错的-Vol 46</p>
                      <p>
                        本期节目关注风口上的小米汽车，主播借助在营销、产品上的经验解答。欢迎在评论区留言发表你对小米汽车的感受与看法，对于节目话题的更多观点，获取更多未呈现在节目中的扩展阅读，欢迎加群讨论
                      </p>
                      <p>
                        <span>30分钟 · 03/29</span>
                        <span>
                          <SlEarphones />
                          4.3万+
                          <SlBubble />
                          349
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="search-result-episode-item">
                    <div className="left">
                      <ColorfulShadow
                        className="episode-cover"
                        curPointer
                        mask
                        src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                      />
                    </div>
                    <div className="right">
                      <p>小米SU7营销复盘：你所知道的为什么都是错的-Vol 46</p>
                      <p>
                        本期节目关注风口上的小米汽车，主播借助在营销、产品上的经验解答。欢迎在评论区留言发表你对小米汽车的感受与看法，对于节目话题的更多观点，获取更多未呈现在节目中的扩展阅读，欢迎加群讨论
                      </p>
                      <p>
                        <span>30分钟 · 03/29</span>
                        <span>
                          <SlEarphones />
                          4.3万+
                          <SlBubble />
                          349
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="search-result-episode-item">
                    <div className="left">
                      <ColorfulShadow
                        className="episode-cover"
                        curPointer
                        mask
                        src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                      />
                    </div>
                    <div className="right">
                      <p>小米SU7营销复盘：你所知道的为什么都是错的-Vol 46</p>
                      <p>
                        本期节目关注风口上的小米汽车，主播借助在营销、产品上的经验解答。欢迎在评论区留言发表你对小米汽车的感受与看法，对于节目话题的更多观点，获取更多未呈现在节目中的扩展阅读，欢迎加群讨论
                      </p>
                      <p>
                        <span>30分钟 · 03/29</span>
                        <span>
                          <SlEarphones />
                          4.3万+
                          <SlBubble />
                          349
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="search-result-episode-item">
                    <div className="left">
                      <ColorfulShadow
                        className="episode-cover"
                        curPointer
                        mask
                        src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                      />
                    </div>
                    <div className="right">
                      <p>小米SU7营销复盘：你所知道的为什么都是错的-Vol 46</p>
                      <p>
                        本期节目关注风口上的小米汽车，主播借助在营销、产品上的经验解答。欢迎在评论区留言发表你对小米汽车的感受与看法，对于节目话题的更多观点，获取更多未呈现在节目中的扩展阅读，欢迎加群讨论
                      </p>
                      <p>
                        <span>30分钟 · 03/29</span>
                        <span>
                          <SlEarphones />
                          4.3万+
                          <SlBubble />
                          349
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="search-result-episode-item">
                    <div className="left">
                      <ColorfulShadow
                        className="episode-cover"
                        curPointer
                        mask
                        src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                      />
                    </div>
                    <div className="right">
                      <p>小米SU7营销复盘：你所知道的为什么都是错的-Vol 46</p>
                      <p>
                        本期节目关注风口上的小米汽车，主播借助在营销、产品上的经验解答。欢迎在评论区留言发表你对小米汽车的感受与看法，对于节目话题的更多观点，获取更多未呈现在节目中的扩展阅读，欢迎加群讨论
                      </p>
                      <p>
                        <span>30分钟 · 03/29</span>
                        <span>
                          <SlEarphones />
                          4.3万+
                          <SlBubble />
                          349
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="search-result-episode-item">
                    <div className="left">
                      <ColorfulShadow
                        className="episode-cover"
                        curPointer
                        mask
                        src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                      />
                    </div>
                    <div className="right">
                      <p>小米SU7营销复盘：你所知道的为什么都是错的-Vol 46</p>
                      <p>
                        本期节目关注风口上的小米汽车，主播借助在营销、产品上的经验解答。欢迎在评论区留言发表你对小米汽车的感受与看法，对于节目话题的更多观点，获取更多未呈现在节目中的扩展阅读，欢迎加群讨论
                      </p>
                      <p>
                        <span>30分钟 · 03/29</span>
                        <span>
                          <SlEarphones />
                          4.3万+
                          <SlBubble />
                          349
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="USER">
                <div className="search-result-user-layout">
                  <div
                    className="search-result-user-item"
                    onClick={() => {
                      setProfileModal({
                        open: true,
                        uid: '123',
                      })
                    }}
                  >
                    <div className="user-avatar">
                      <Avatar
                        className="avatar-box"
                        src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                        fallback="A"
                      />
                    </div>
                    <div className="user-info">小米</div>
                  </div>
                  <div className="search-result-user-item">
                    <div className="user-avatar">
                      <Avatar
                        className="avatar-box"
                        src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                        fallback="A"
                      />
                    </div>
                    <div className="user-info">小米</div>
                  </div>
                  <div className="search-result-user-item">
                    <div className="user-avatar">
                      <Avatar
                        className="avatar-box"
                        src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                        fallback="A"
                      />
                    </div>
                    <div className="user-info">小米</div>
                  </div>
                  <div className="search-result-user-item">
                    <div className="user-avatar">
                      <Avatar
                        className="avatar-box"
                        src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                        fallback="A"
                      />
                    </div>
                    <div className="user-info">小米</div>
                  </div>
                  <div className="search-result-user-item">
                    <div className="user-avatar">
                      <Avatar
                        className="avatar-box"
                        src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                        fallback="A"
                      />
                    </div>
                    <div className="user-info">小米</div>
                  </div>
                  <div className="search-result-user-item">
                    <div className="user-avatar">
                      <Avatar
                        className="avatar-box"
                        src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                        fallback="A"
                      />
                    </div>
                    <div className="user-info">小米</div>
                  </div>
                </div>
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </div>
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
