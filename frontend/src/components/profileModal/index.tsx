import React, { useEffect, useState } from 'react'
import {
  Dialog,
  Avatar,
  IconButton,
  Text,
  ScrollArea,
  Flex,
  Separator,
  Card,
} from '@radix-ui/themes'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import {
  ChevronRightIcon,
  Cross1Icon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons'
import { modalType } from '@/types/modal'
import { useWindowSize, usePlayer } from '@/hooks'
import styles from './index.module.scss'
import {
  ColorfulShadow,
  MyDropdownMenu,
  PickModal,
  Empty,
  PayEpisodeTag,
  OwnedEpisodeTag,
} from '@/components'
import {
  SlBubble,
  SlEarphones,
  SlSymbleFemale,
  SlSymbolMale,
} from 'react-icons/sl'
import { getProfile } from '@/api/profile'
import { getUserStats } from '@/api/user'
import {
  DialogType,
  ShowMessageDialog,
  ShowPodcastDetailModal,
  ShowStickerModal,
  ShowSubscriptionModal,
  Storage,
  fetchPrivateMediaUrl,
  toast,
  showEpisodeDetailModal,
} from '@/utils'
import { UserProfileType } from '@/types/profile'
import { renderGender } from '@/utils/string'
import { userStats, userType } from '@/types/user'
import { formatTime } from '@/pages/profile/components/mileageDuration'
import { stickerType } from '@/types/sticker'
import { sticker } from '@/api/sticker'
import { playedList } from '@/api/played'
import { EpisodeType } from '@/types/episode'
import dayjs from 'dayjs'
import { onRelationUpdate } from '@/pages/profile/components/followModal'
import { onBlockedUserCreate } from '@/pages/setting/components/blockedModal'
import { CONSTANT } from '@/types/constant'
import { pickListRecent } from '@/api/pick'
import { ownedPodcasts, type ownedPodcastType } from '@/api/podcast'
import { PickRecentType } from '@/types/pick'
import { PlayerEpisodeInfoType } from '@/utils/player'
import { PodcastType } from '@/types/podcast'

type IProps = {
  uid: string
} & modalType

/**
 * 个人信息弹窗
 * @param uid
 * @param open
 * @param onClose
 * @constructor
 */
export const ProfileModal: React.FC<IProps> = ({ uid, open, onClose }) => {
  const userInfo: userType = Storage.get('user_info')
  const { width, height } = useWindowSize()
  const [dropDownMenuOpen, setDropDownMenuOpen] = useState<boolean>(false)
  const [profileData, setProfileData] = useState<UserProfileType>()
  const [stats, setStats] = useState<userStats>({
    followerCount: 0,
    followingCount: 0,
    subscriptionCount: 0,
    totalPlayedSeconds: 0,
  })
  const [time, setTime] = useState<number[]>([0, 0, 0])
  const [stickerData, setStickerData] = useState<{
    records: stickerType[]
    total: number
  }>({
    records: [],
    total: 0,
  })
  const [playedLists, setPlayedLists] = useState<EpisodeType[]>([])
  const [pickRecentList, setPickRecentList] = useState<{
    records: PickRecentType[]
    total: number
  }>({
    records: [],
    total: 0,
  })
  const [pickModal, setPickModal] = useState({
    open: false,
    uid: '',
  })
  const [ownedPodcastLists, setOwnedPodcastLists] = useState<PodcastType[]>()
  const player = usePlayer()

  const avoidDefaultDomBehavior = (e: Event) => {
    e.preventDefault()
  }

  /**
   * 获取用户创建的播客节目
   */
  const fetchOwnedPodcastsInfo = () => {
    const params: ownedPodcastType = {
      uid,
    }

    ownedPodcasts(params)
      .then((res) => setOwnedPodcastLists(res.data.data))
      .catch((err) => {
        console.error(err)
      })
  }

  /**
   * 获取最近听过列表
   */
  const onGetPlayedList = () => {
    const params = {
      uid,
    }

    playedList(params)
      .then((res) => setPlayedLists(res.data.data))
      .catch((err) => {
        console.error(err)
      })
  }

  /**
   * 获取用户的贴纸数据
   */
  const onGetSticker = () => {
    const params = {
      uid,
    }

    sticker(params)
      .then((res) =>
        setStickerData({
          records: res.data.data,
          total: res.data.total,
        }),
      )
      .catch((err) => {
        console.error(err)
      })
  }

  /**
   * 获取用户的统计信息
   */
  const onGetUserStats = () => {
    const params = {
      uid,
    }

    getUserStats(params)
      .then((res) => {
        const total: number = res.data.data.totalPlayedSeconds

        setTime(formatTime(total))
        setStats(res.data.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  /**
   * 获取用户个人信息
   */
  const getUserProfile = () => {
    const params = {
      uid,
    }
    getProfile(params)
      .then((res) => setProfileData(res.data.data))
      .catch(() => {
        toast('获取用户信息失败', { type: 'warn' })
      })
  }

  /**
   * 拉黑用户
   * @param uid 用户的 uid
   * @param nickname 用户的昵称
   */
  const onBlockHandle = (uid: string, nickname: string) => {
    if (uid === userInfo.uid) {
      return toast(CONSTANT.BLOCK_YOURSELF)
    }

    ShowMessageDialog(
      DialogType.QUESTION,
      '提示',
      `确定要将「${nickname}」加入黑名单吗？\n对方将无法与你互动，也无法关注你`,
    ).then((res) => {
      if (res === 'Yes' || res === '是') {
        onBlockedUserCreate(uid, () => {
          // onGetUserStats()
          // getUserProfile()
          onClose(true)
        })
      }
    })
  }

  /**
   * 查询用户的喜欢（片段）
   */
  const getPickRecentList = () => {
    const params = {
      uid,
    }

    pickListRecent(params)
      .then((res) =>
        setPickRecentList({
          records: res.data.data,
          total: res.data.total,
        }),
      )
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    if (open) {
      getUserProfile()
      onGetUserStats()
      onGetSticker()
      onGetPlayedList()
      getPickRecentList()
      fetchOwnedPodcastsInfo()
    }

    return () => {
      setProfileData(undefined)
      setStats({
        followerCount: 0,
        followingCount: 0,
        subscriptionCount: 0,
        totalPlayedSeconds: 0,
      })
      setStickerData({
        records: [],
        total: 0,
      })
      setTime([0, 0, 0])
      setPlayedLists([])
      setPickRecentList({
        records: [],
        total: 0,
      })
      setOwnedPodcastLists([])
    }
  }, [open])

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onClose}
    >
      <Dialog.Content
        style={{
          maxWidth: width * 0.7,
          height: height * 0.8,
          padding: 0,
        }}
        onPointerDownOutside={avoidDefaultDomBehavior}
        onInteractOutside={avoidDefaultDomBehavior}
      >
        <VisuallyHidden.Root>
          <Dialog.Title />
          <Dialog.Description />
        </VisuallyHidden.Root>

        <ScrollArea
          type="scroll"
          scrollbars="vertical"
          style={{ height: height * 0.8 }}
        >
          <div className={styles['profile-modal-layout']}>
            <div className={styles['pm-action-button']}>
              <IconButton
                onClick={() => {
                  onClose()
                }}
                variant="soft"
                radius="full"
                color="gray"
              >
                <Cross1Icon />
              </IconButton>

              <MyDropdownMenu
                open={dropDownMenuOpen}
                onClose={() => {
                  setDropDownMenuOpen(false)
                }}
                trigger={
                  <IconButton
                    className={styles['more-button']}
                    onClick={() => {
                      setDropDownMenuOpen(true)
                    }}
                    variant="soft"
                    radius="full"
                    color="gray"
                  >
                    <DotsHorizontalIcon />
                  </IconButton>
                }
              >
                <MyDropdownMenu.Item
                  onClick={() => {
                    if (profileData?.uid) {
                      onRelationUpdate(
                        profileData.uid,
                        profileData?.relation,
                        profileData?.nickname,
                        () => {
                          onGetUserStats()
                          getUserProfile()
                        },
                      )
                    }
                  }}
                >
                  {profileData?.relation === 'FOLLOWING'
                    ? '取消关注'
                    : `关注${renderGender(profileData?.gender)}`}
                </MyDropdownMenu.Item>
                <MyDropdownMenu.Item
                  danger
                  onClick={() => {
                    if (profileData?.uid) {
                      onBlockHandle(profileData.uid, profileData?.nickname)
                    }
                  }}
                >
                  加入黑名单
                </MyDropdownMenu.Item>
              </MyDropdownMenu>
            </div>

            <div className={styles['profile-avatar-layout']}>
              <div className={styles['pm-ip-loc']}>
                IP属地：{profileData?.ipLoc || '未知'}
              </div>
              <div
                className={styles['background-image']}
                style={{
                  background: `url(${profileData?.avatar.picture.picUrl}) no-repeat center center / cover`,
                  filter: 'blur(30px)',
                }}
              />
              <Avatar
                radius="full"
                className={styles['profile-avatar']}
                src={profileData?.avatar.picture.picUrl}
                fallback="avatar"
              />
            </div>

            <div className={styles['profile-detail-layout']}>
              <div className={styles['pm-nickname']}>
                <Text
                  as="div"
                  align="center"
                  size="6"
                >
                  {profileData?.nickname}
                  {profileData?.gender === 'MALE' ? (
                    <SlSymbolMale
                      fontSize="16"
                      color="royalblue"
                      style={{ marginLeft: '8px' }}
                    />
                  ) : null}
                  {profileData?.gender === 'FEMALE' ? (
                    <SlSymbleFemale
                      fontSize="16"
                      color="pink"
                      style={{ marginLeft: '8px' }}
                    />
                  ) : null}
                </Text>
                <Text
                  as="div"
                  align="center"
                  size="2"
                  mt="2"
                >
                  {profileData?.bio}
                </Text>
              </div>

              <div className={styles['pm-follow']}>
                <Flex
                  gap="3"
                  align="center"
                >
                  <div className={styles['chunk']}>
                    <p>{stats.followingCount}</p>
                    <p>关注</p>
                  </div>
                  <Separator
                    className={styles['separator']}
                    size="2"
                    orientation="vertical"
                  />
                  <div className={styles['chunk']}>
                    <p>{stats.followerCount}</p>
                    <p>粉丝</p>
                  </div>
                  <Separator
                    className={styles['separator']}
                    size="2"
                    orientation="vertical"
                  />
                  <div
                    style={{ cursor: 'pointer' }}
                    className={styles['chunk']}
                    onClick={() => {
                      if (profileData?.uid) {
                        ShowSubscriptionModal({
                          uid: profileData?.uid,
                          perspective: renderGender(profileData?.gender),
                        }).catch(() => {
                          toast(CONSTANT.ERROR_SUBSCRIPTIONS_VIEW, {
                            type: 'warn',
                          })
                        })
                      } else {
                        toast(CONSTANT.ERROR_SUBSCRIPTIONS_VIEW, {
                          type: 'warn',
                        })
                      }
                    }}
                  >
                    <p>{stats.subscriptionCount}</p>
                    <p>订阅</p>
                  </div>
                  <Separator
                    className={styles['separator']}
                    size="2"
                    orientation="vertical"
                  />
                  <div className={styles['chunk']}>
                    <p>
                      {time[0]}
                      <span>时</span>
                      {time[1]}
                      <span>分</span>
                    </p>
                    <p>收听时长</p>
                  </div>
                </Flex>
              </div>
            </div>

            {ownedPodcastLists?.length !== 0 && (
              <div className={styles['pm-podcast-layout']}>
                <div className={styles['pm-podcast-content']}>
                  <h3>{renderGender(profileData?.gender)}的播客</h3>

                  {ownedPodcastLists?.map((item) => (
                    <div
                      className={styles['pm-podcast-item']}
                      key={item.pid}
                    >
                      <div className={styles['left']}>
                        <ColorfulShadow
                          className={styles['episode-cover']}
                          curPointer
                          src={item.image.picUrl}
                        />
                      </div>
                      <div className={styles['right']}>
                        <p
                          onClick={() => {
                            ShowPodcastDetailModal({
                              pid: item.pid,
                            }).catch(() => {
                              toast(CONSTANT.ERROR_PODCAST_DETAIL_VIEW, {
                                type: 'warn',
                              })
                            })
                          }}
                        >
                          {item.title}
                        </p>
                        <p>{item.brief}</p>
                        {item.episodeCount !== 0 && (
                          <p>更新至第{item.episodeCount}期</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pickRecentList.total !== 0 && (
              <div className={styles['pm-like-content']}>
                <h3
                  style={pickRecentList.total > 4 ? { cursor: 'pointer' } : {}}
                  onClick={() => {
                    if (pickRecentList.total > 4 && profileData?.uid) {
                      setPickModal({
                        open: true,
                        uid: profileData.uid,
                      })
                    }
                  }}
                >
                  {renderGender(profileData?.gender)}的喜欢
                  {pickRecentList.total !== 0
                    ? `(${pickRecentList.total})`
                    : null}
                  {pickRecentList.total > 4 && <ChevronRightIcon />}
                </h3>

                {pickRecentList.records.map((item) => (
                  <Card
                    className={styles['pm-like-item']}
                    key={item.id}
                  >
                    <div className={styles['top']}>
                      <span>{dayjs(item.pickedAt).format('YYYY/MM/DD')}</span>
                      <span>
                        <span>{item.likeCount}</span>
                        <img
                          src={item.story.iconUrl}
                          alt="like_icon"
                        />
                      </span>
                    </div>
                    <div
                      className={styles['middle']}
                      title={item.story.text}
                    >
                      {item.story.text}
                    </div>
                    <Separator
                      my="3"
                      size="4"
                    />
                    <div className={styles['bottom']}>
                      {item.episode.status === 'REMOVED' ? (
                        <div className={styles['episode-removed']}>
                          {CONSTANT.EPISODE_STATUS_REMOVED}
                        </div>
                      ) : (
                        <>
                          <div className={styles['left']}>
                            <ColorfulShadow
                              className={styles['episode-cover']}
                              curPointer
                              mask
                              src={
                                item.episode?.image
                                  ? item.episode.image.picUrl
                                  : item.episode.podcast.image.picUrl
                              }
                              onPlay={() => {
                                const episodeInfo: PlayerEpisodeInfoType = {
                                  title: item.episode.title,
                                  eid: item.episode.eid,
                                  pid: item.episode.pid,
                                  cover: item.episode.image
                                    ? item.episode.image.picUrl
                                    : item.episode.podcast.image.picUrl,
                                  liked: item.episode.isFavorited,
                                }

                                player.load(
                                  item.episode.media.source.url,
                                  episodeInfo,
                                )
                                player.play()
                              }}
                            />
                          </div>
                          <div className={styles['right']}>
                            <p
                              onClick={() => {
                                showEpisodeDetailModal(item.episode.eid)
                              }}
                            >
                              {item.episode.title}
                            </p>
                            <p
                              onClick={() => {
                                ShowPodcastDetailModal({
                                  pid: item.episode.podcast.pid,
                                }).catch(() => {
                                  toast(CONSTANT.ERROR_PODCAST_DETAIL_VIEW, {
                                    type: 'warn',
                                  })
                                })
                              }}
                            >
                              {item.episode.podcast.title}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className={styles['pm-sticker-layout']}>
              <div className={styles['pm-sticker-content']}>
                <h3>{renderGender(profileData?.gender)}的贴纸库</h3>

                {stickerData.total === 0 ? (
                  <Empty />
                ) : (
                  <Card
                    className={styles['sticker-card']}
                    onClick={() => {
                      ShowStickerModal({
                        uid,
                        perspective: renderGender(profileData?.gender),
                      }).catch(() => {
                        toast(CONSTANT.ERROR_STICKER_VIEW, {
                          type: 'warn',
                        })
                      })
                    }}
                  >
                    <div
                      className={styles['sticker-bgi']}
                      style={{
                        backgroundImage: `url(${stickerData.total === 0 ? '' : stickerData.records[0].image.picUrl})`,
                      }}
                    />
                    <div>
                      <span>{stickerData.total}</span>&nbsp;张贴纸
                      <ChevronRightIcon />
                    </div>
                    <div>
                      最新：
                      {stickerData.total === 0
                        ? '-'
                        : stickerData.records[0].name}
                    </div>
                  </Card>
                )}
              </div>
            </div>

            <div className={styles['pm-history-content']}>
              <h3>最近听过</h3>

              {playedLists.length === 0 && <Empty />}

              {playedLists.map((item) => (
                <div
                  className={styles['pm-history-episode-item']}
                  key={item.eid}
                >
                  <div className={styles['left']}>
                    <ColorfulShadow
                      className={styles['episode-cover']}
                      curPointer
                      mask
                      src={
                        item.image
                          ? item.image.picUrl
                          : item.podcast.image.picUrl
                      }
                      onPlay={async () => {
                        const episodeInfo: PlayerEpisodeInfoType = {
                          title: item.title,
                          eid: item.eid,
                          pid: item.podcast.pid,
                          cover: item?.image
                            ? item.image.picUrl
                            : item.podcast.image.picUrl,
                          liked: item.isFavorited,
                        }
                        let url: string = ''

                        if (item.payType === 'FREE') {
                          url = item.media.source.url
                        } else if (item.payType === 'PAY_EPISODE' && item.isOwned) {
                          url = await fetchPrivateMediaUrl(item.eid)
                        } else if (
                          item.payType === 'PAY_EPISODE' &&
                          !item.isOwned &&
                          item.trial?.segment
                        ) {
                          url = item.trial?.segment
                          toast('正在播放试听内容', {
                            type: 'info',
                            duration: 5000,
                          })
                        } else {
                          toast('播放失败', {
                            type: 'warn',
                          })
                          return
                        }

                        player.load(url, episodeInfo)
                        player.play()
                      }}
                      onAddToPlaylist={async () => {
                        const episodeInfo: PlayerEpisodeInfoType = {
                          title: item.title,
                          eid: item.eid,
                          pid: item.podcast.pid,
                          cover: item?.image
                            ? item.image.picUrl
                            : item.podcast.image.picUrl,
                          liked: item.isFavorited,
                        }
                        let url: string = ''

                        if (item.payType === 'FREE') {
                          url = item.media.source.url
                        } else if (item.payType === 'PAY_EPISODE' && item.isOwned) {
                          url = await fetchPrivateMediaUrl(item.eid)
                        } else if (
                          item.payType === 'PAY_EPISODE' &&
                          !item.isOwned &&
                          item.trial?.segment
                        ) {
                          url = item.trial?.segment
                        } else {
                          toast('添加失败', { type: 'warn' })
                          return
                        }

                        const added = player.addToPlaylist(url, episodeInfo)
                        toast(added ? '已添加到播放列表' : '已在播放列表中')
                      }}
                    />
                  </div>
                  <div className={styles['right']}>
                    <p>
                      {item.isOwned && <OwnedEpisodeTag />}
                      {item.payType === 'PAY_EPISODE' && !item.isOwned && (
                        <PayEpisodeTag />
                      )}
                      {item.title}
                    </p>
                    <p title={item.description}>{item.description}</p>
                    <p>
                      <span>
                        {Math.floor(item.duration / 60)}分钟 ·{' '}
                        {dayjs(item.pubDate).format('YYYY/MM/DD')}
                      </span>
                      <span>
                        <SlEarphones />
                        {item.playCount}
                      </span>
                      <span>
                        <SlBubble />
                        {item.commentCount}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <PickModal
            perspective={renderGender(profileData?.gender)}
            total={pickRecentList.total}
            uid={pickModal.uid}
            open={pickModal.open}
            onClose={() => {
              setPickModal({ open: false, uid: '' })
            }}
          />
        </ScrollArea>
      </Dialog.Content>
    </Dialog.Root>
  )
}
