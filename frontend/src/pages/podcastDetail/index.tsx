import React, { useEffect, useState } from 'react'
import { ColorfulShadow, NavBackButton, ProfileModal } from '@/components'
import { useLocation } from 'react-router-dom'
import { AspectRatio, Box, Button, Heading, Text } from '@radix-ui/themes'
import { CheckIcon, PlusIcon } from '@radix-ui/react-icons'
import { SlBubble, SlEarphones } from 'react-icons/sl'
import { podcastDetail } from '@/api/podcast'
import { episodeList } from '@/api/episode'
import { PodcastType } from '@/types/podcast'
import './index.modules.scss'
import { EpisodeType } from '@/types/episode'
import { isEmpty } from 'lodash'
import dayjs from 'dayjs'

export const PodcastDetail: React.FC = () => {
  const { pid } = useLocation().state
  const [podcastDetailData, setPodcastDetailData] = useState<PodcastType>()
  const [profileModal, setProfileModal] = useState<{
    open: boolean
    uid: string
  }>({
    open: false,
    uid: '',
  })
  const [episodeData, setEpisodeData] = useState<{
    records: EpisodeType[]
    total: number
    loadMoreKey: {}
  }>({
    records: [],
    total: 0,
    loadMoreKey: {},
  })
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * 获取播客详情
   */
  const getDetail = () => {
    const params = {
      pid,
    }

    podcastDetail(params)
      .then((res) => setPodcastDetailData(res.data.data))
      .catch((err) => {
        console.error(err)
      })
  }

  /**
   * 获取播客单集列表
   * @param loadMoreKey
   */
  const getEpisodeList = (loadMoreKey = {}, order = 'desc') => {
    let params: { pid: string; order: string; loadMoreKey?: {} } = {
      pid,
      order,
    }

    if (!isEmpty(loadMoreKey)) {
      setLoading(true)

      params = {
        ...params,
        loadMoreKey,
      }
    }

    episodeList(params)
      .then((res) => {
        if (isEmpty(loadMoreKey)) {
          setEpisodeData({
            records: res.data.data,
            total: res.data.total,
            loadMoreKey: res.data?.loadMoreKey,
          })
        } else {
          setEpisodeData({
            records: [...episodeData.records, ...res.data.data],
            total: res.data.total,
            loadMoreKey: res.data?.loadMoreKey,
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
    if (pid) {
      getDetail()
      getEpisodeList()
    }
  }, [pid])

  return (
    <div className="podcast-detail-layout">
      <NavBackButton />

      <div className="podcast-detail-info">
        <div className="pdi-top">
          <Box className="pdi-top-cover">
            <img
              src={podcastDetailData?.image.picUrl}
              alt={podcastDetailData?.title}
              style={{
                objectFit: 'cover',
                width: '20rem',
                height: '20rem',
                borderRadius: 'var(--radius-6)',
              }}
            />
          </Box>

          <div className="pdi-top-description">
            <div>
              <Heading
                size="9"
                align="left"
                style={{ color: podcastDetailData?.color.dark }}
              >
                {podcastDetailData?.title}
              </Heading>
              <Text
                align="left"
                as="div"
                mt="4"
                mb="4"
                size="5"
                style={{ fontWeight: '300' }}
              >
                {podcastDetailData?.description}
              </Text>
              <div className="sub">
                <Text
                  size="5"
                  mr="5"
                  style={{ fontWeight: '300' }}
                >
                  {podcastDetailData?.subscriptionCount} 订阅
                </Text>
                {podcastDetailData?.subscriptionStatus === 'ON' && (
                  <Button
                    variant="soft"
                    color="gray"
                  >
                    <CheckIcon />
                    已订阅
                  </Button>
                )}
                {podcastDetailData?.subscriptionStatus === 'OFF' && (
                  <Button variant="soft">
                    <PlusIcon />
                    订阅
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="podcast-detail">
          <Box
            mt="6"
            width="100%"
            height="100%"
          >
            <div className="podcasters">
              <div className="label">节目主播</div>

              <div className="layout">
                {podcastDetailData?.podcasters.map((item) => (
                  <div
                    key={item.uid}
                    className="podcaster"
                    onClick={() => {
                      setProfileModal({
                        open: true,
                        uid: item.uid,
                      })
                    }}
                  >
                    <div className="top">
                      <AspectRatio ratio={1}>
                        <img
                          src={item.avatar.picture.picUrl}
                          alt={item.nickname}
                        />
                      </AspectRatio>
                    </div>
                    <div className="bottom">{item.nickname}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="episode-lists">
              <div className="label">节目列表({episodeData.total})</div>

              {episodeData.records.map((item) => (
                <div className="episode-item">
                  <div className="left">
                    <ColorfulShadow
                      className="episode-cover"
                      curPointer
                      mask
                      src={
                        item?.image
                          ? item.image.picUrl
                          : item.podcast.image.picUrl
                      }
                    />
                  </div>
                  <div className="right">
                    <p>{item.title}</p>
                    <p>{item.description}</p>
                    <p>
                      <span>
                        {Math.floor(item.duration / 60)}分钟 ·{' '}
                        {dayjs(item.pubDate).format('MM/DD')}
                      </span>
                      <span>
                        <SlEarphones />
                        {item.playCount}
                        <SlBubble />
                        {item.commentCount}
                      </span>
                    </p>
                  </div>
                </div>
              ))}

              <div
                style={
                  isEmpty(episodeData.loadMoreKey)
                    ? { display: 'none' }
                    : { paddingBottom: '3rem' }
                }
                className="load-more-button"
              >
                <Button
                  color="gray"
                  onClick={() => {
                    getEpisodeList(episodeData.loadMoreKey)
                  }}
                  loading={loading}
                >
                  加载更多
                </Button>
              </div>
            </div>
          </Box>
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
