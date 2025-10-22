import React, { useEffect, useState } from 'react'
import { ColorfulShadow, ProfileModal } from '@/components'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AspectRatio,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  ScrollArea,
  Text,
} from '@radix-ui/themes'
import { InfoCircledIcon, PlusIcon, BellIcon } from '@radix-ui/react-icons'
import { SlBubble, SlEarphones } from 'react-icons/sl'
import {
  podcastDetail,
  podcastGetInfo,
  podcastRelated,
  podcastBulletin,
} from '@/api/podcast'
import { episodeList } from '@/api/episode'
import { PodcastBulletinType, PodcastType } from '@/types/podcast'
import styles from './index.module.scss'
import '@/assets/global/animate.css'
import { EpisodeType } from '@/types/episode'
import { isEmpty } from 'lodash'
import dayjs from 'dayjs'
import { DialogType, ShowMessageDialog, toast } from '@/utils'
import { updateSubscription } from '@/api/subscription'
import { PodcastBulletinModal } from './components/podcastBulletinModal'
import { usePlayer } from '@/hooks'
import { PlayerEpisodeInfoType } from '@/utils/player'

export const PodcastDetail: React.FC = () => {
  const { pid } = useLocation().state
  const [podcastDetailData, setPodcastDetailData] = useState<PodcastType>({
    author: '',
    brief: '',
    color: {
      dark: '',
      light: '',
      original: '',
    },
    contacts: [],
    description: '',
    episodeCount: 0,
    hasPopularEpisodes: false,
    image: {
      format: '',
      height: 0,
      width: 0,
      largePicUrl: '',
      middlePicUrl: '',
      picUrl: '',
      smallPicUrl: '',
      thumbnaiUrl: '',
    },
    isCustomized: false,
    latestEpisodePubDate: new Date(),
    payEpisodeCount: 0,
    payType: '',
    permissions: null,
    pid: '',
    podcasters: [],
    readTrackInfo: {},
    status: '',
    subscriptionCount: 0,
    subscriptionPush: false,
    subscriptionPushPriority: '',
    subscriptionStar: false,
    subscriptionStatus: '',
    syncMode: '',
    title: '',
    topicLabels: null,
    type: '',
  })
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
  const [infoLoading, setInfoLoading] = useState<boolean>(false)
  const [podcastRelatedList, setPodcastRelatedList] = useState<
    {
      podcast: PodcastType
      recommendation: string
    }[]
  >([])
  const [bulletinData, setBulletinData] = useState<PodcastBulletinType>()
  const [swing, setSwing] = useState<boolean>(false)
  const [bulletinModalOpen, setBulletinModalOpen] = useState<boolean>(false)
  const player = usePlayer()

  useEffect(() => {
    if (bulletinData) {
      const timer = setInterval(() => {
        setSwing((prev) => !prev)
      }, 1500)

      return () => {
        clearInterval(timer)
      }
    }
  }, [bulletinData])

  const navigateTo = useNavigate()
  const goPodcastDetail = (pid: string) => {
    navigateTo('/podcast/detail', {
      state: {
        pid,
      },
    })
  }

  /**
   * 获取节目公告
   */
  const getPodcastBulletin = () => {
    const params = {
      pid,
    }

    podcastBulletin(params)
      .then((res) => setBulletinData(res.data.data))
      .catch((err) => {
        console.error(err)
      })
  }

  /**
   * 获取节目信息
   */
  const getPodcastInfo = () => {
    setInfoLoading(true)
    const params = {
      pid,
    }

    podcastGetInfo(params)
      .then((res) => {
        ShowMessageDialog(
          DialogType.INFO,
          '关于节目',
          `IP属地：${res.data.data.ipLoc}\r\n账号主体：${res.data.data.subject}`,
        ).then()
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setInfoLoading(false)
      })
  }

  /**
   * 获取相关节目推荐
   */
  const getPodcastRelated = () => {
    const params = {
      pid,
    }

    podcastRelated(params)
      .then((res) => setPodcastRelatedList(res.data.data))
      .catch((err) => {
        console.error(err)
      })
  }

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
   * @param loadMoreKey 加载更多
   * @param order 排序
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

  /**
   * 更新订阅
   * @param pid 节目id
   * @param podcastTitle 节目标题
   * @param mode 是否订阅
   */
  const onUpdateSubscription = (
    pid: string,
    podcastTitle: string,
    mode: 'ON' | 'OFF',
  ) => {
    const params = {
      pid,
      mode,
    }
    let toastText = '订阅成功'

    if (mode === 'OFF') {
      toastText = '取消订阅成功'
      ShowMessageDialog(
        DialogType.QUESTION,
        '提示',
        `确定不再订阅「${podcastTitle}」吗？`,
      ).then((res) => {
        if (res === 'Yes' || res === '是') {
          updateSubscription(params)
            .then(() =>
              toast(toastText, { duration: 1000 }, () => {
                getDetail()
              }),
            )
            .catch(() => {
              toast('操作失败')
            })
        }
      })
    } else {
      updateSubscription(params)
        .then(() => {
          toast(toastText, { duration: 1000 }, () => {
            getDetail()
          })
        })
        .catch(() => {
          toast('操作失败')
        })
    }
  }

  useEffect(() => {
    if (pid) {
      getDetail()
      getEpisodeList()
      getPodcastRelated()
      getPodcastBulletin()
    }
  }, [pid])

  return (
    <div className={styles['podcast-detail-layout']}>
      <div className={styles['podcast-detail-info']}>
        <div className={styles['pdi-top']}>
          <Box className={styles['pdi-top-cover']}>
            <img
              src={podcastDetailData?.image?.picUrl}
              alt={podcastDetailData?.title}
              style={{
                objectFit: 'cover',
                width: '20rem',
                height: '20rem',
                borderRadius: 'var(--radius-6)',
              }}
            />
          </Box>

          <div className={styles['pdi-top-description']}>
            <div>
              <Heading
                size="9"
                align="left"
                style={{ color: podcastDetailData?.color?.dark }}
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
              <div className={styles['sub']}>
                <Text
                  size="5"
                  mr="5"
                  style={{ fontWeight: '300' }}
                >
                  {podcastDetailData?.subscriptionCount} 订阅
                </Text>
                <Button
                  variant="soft"
                  color={
                    podcastDetailData?.subscriptionStatus === 'ON'
                      ? 'gray'
                      : undefined
                  }
                  onClick={() => {
                    onUpdateSubscription(
                      podcastDetailData.pid,
                      podcastDetailData.title,
                      podcastDetailData.subscriptionStatus === 'ON'
                        ? 'OFF'
                        : 'ON',
                    )
                  }}
                >
                  {podcastDetailData?.subscriptionStatus === 'ON' ? null : (
                    <PlusIcon />
                  )}
                  {podcastDetailData?.subscriptionStatus === 'ON'
                    ? '已订阅'
                    : '订阅'}
                </Button>

                {bulletinData && (
                  <IconButton
                    variant="soft"
                    color="gray"
                    style={{ marginLeft: 12 }}
                    onClick={() => {
                      setBulletinModalOpen(true)
                    }}
                  >
                    <BellIcon className={swing ? 'swing' : ''} />
                  </IconButton>
                )}

                <IconButton
                  variant="soft"
                  color="gray"
                  style={{ marginLeft: 12 }}
                  onClick={() => {
                    getPodcastInfo()
                  }}
                  loading={infoLoading}
                >
                  <InfoCircledIcon />
                </IconButton>
              </div>
            </div>
          </div>
        </div>

        <div className={styles['podcast-detail']}>
          <Box
            mt="6"
            width="100%"
            height="100%"
          >
            <div className={styles['podcasters']}>
              <div className={styles['label']}>节目主播</div>

              <div className={styles['layout']}>
                {podcastDetailData?.podcasters?.map((item) => (
                  <div
                    key={item.uid}
                    className={styles['podcaster']}
                    onClick={() => {
                      setProfileModal({
                        open: true,
                        uid: item.uid,
                      })
                    }}
                    title={item.nickname}
                  >
                    <div className={styles['top']}>
                      <AspectRatio ratio={1}>
                        <img
                          src={item.avatar.picture.picUrl}
                          alt={item.nickname}
                        />
                      </AspectRatio>
                    </div>
                    <div className={styles['bottom']}>{item.nickname}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles['episode-lists']}>
              <div className={styles['label']}>
                节目列表({episodeData.total})
              </div>

              {episodeData.records.map((item) => (
                <div
                  className={styles['episode-item']}
                  key={item.eid}
                >
                  <div className={styles['left']}>
                    <ColorfulShadow
                      className={styles['episode-cover']}
                      curPointer
                      mask
                      src={
                        item?.image
                          ? item.image.picUrl
                          : item.podcast.image.picUrl
                      }
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
                  <div className={styles['right']}>
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
                className={styles['load-more-button']}
              >
                <Button
                  variant="soft"
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

        <div className={styles['recommended-layout']}>
          <div className={styles['label']}>相关节目推荐</div>

          <div className={styles['recommended-content']}>
            <ScrollArea
              size="2"
              type="hover"
              scrollbars="horizontal"
            >
              <Flex
                gap="7"
                width="700px"
              >
                {podcastRelatedList?.map((item) => (
                  <Box key={item.podcast.pid}>
                    <div className={styles['recommended-item']}>
                      <div className={styles['cover-box']}>
                        <ColorfulShadow
                          className={styles['cover']}
                          src={item.podcast.image.picUrl}
                          curPointer
                          onClick={() => {
                            goPodcastDetail(item.podcast.pid)
                          }}
                        />
                      </div>

                      <div className={styles['podcast-info']}>
                        <p className={styles['podcast-title']}>
                          {item.podcast.title}
                        </p>
                      </div>
                    </div>
                  </Box>
                ))}
              </Flex>
            </ScrollArea>
          </div>
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

      <PodcastBulletinModal
        data={bulletinData}
        open={bulletinModalOpen}
        onClose={() => {
          setBulletinModalOpen(false)
        }}
      />
    </div>
  )
}
