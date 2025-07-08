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
import './index.modules.scss'
import {
  ColorfulShadow,
  MyDropdownMenu,
  StickerModal,
  PickModal,
  Empty,
} from '@/components'
import {
  SlBubble,
  SlEarphones,
  SlSymbleFemale,
  SlSymbolMale,
} from 'react-icons/sl'
import { getProfile } from '@/api/profile'
import { getUserStats } from '@/api/user'
import { DialogType, ShowMessageDialog, Storage, toast } from '@/utils'
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
import { PickRecentType } from '@/types/pick'
import { PlayerEpisodeInfoType } from '@/utils/player'

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
  const [stickerModalOpen, setStickerModalOpen] = useState<boolean>(false)
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
  const player = usePlayer()

  const avoidDefaultDomBehavior = (e: Event) => {
    e.preventDefault()
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
    }
  }, [open])

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onClose}
    >
      <Dialog.Content
        style={{ maxWidth: width * 0.7, height: height * 0.7, padding: 0 }}
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
          style={{ height }}
        >
          <div className="profile-modal-layout">
            <div className="pm-action-button">
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
                    className="more-button"
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

            <div className="profile-avatar-layout">
              <div className="pm-ip-loc">
                IP属地：{profileData?.ipLoc || '未知'}
              </div>
              <div
                className="background-image"
                style={{
                  background: `url(${profileData?.avatar.picture.picUrl}) no-repeat center center / cover`,
                  filter: 'blur(30px)',
                }}
              />
              <Avatar
                radius="full"
                className="profile-avatar"
                src={profileData?.avatar.picture.picUrl}
                fallback="avatar"
              />
            </div>

            <div className="profile-detail-layout">
              <div className="pm-nickname">
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
                      style={{ marginLeft: '6px' }}
                    />
                  ) : null}
                  {profileData?.gender === 'FEMALE' ? (
                    <SlSymbleFemale
                      fontSize="16"
                      color="pink"
                      style={{ marginLeft: '6px' }}
                    />
                  ) : null}
                </Text>
                <Text
                  as="div"
                  align="center"
                  size="2"
                  mt="2"
                >
                  {profileData?.bio || CONSTANT.NO_BIO}
                </Text>
              </div>

              <div className="pm-follow">
                <Flex
                  gap="3"
                  align="center"
                >
                  <div className="chunk">
                    <p>{stats.followingCount}</p>
                    <p>关注</p>
                  </div>
                  <Separator
                    className="separator"
                    size="2"
                    orientation="vertical"
                  />
                  <div className="chunk">
                    <p>{stats.followerCount}</p>
                    <p>粉丝</p>
                  </div>
                  <Separator
                    className="separator"
                    size="2"
                    orientation="vertical"
                  />
                  <div className="chunk">
                    <p>{stats.subscriptionCount}</p>
                    <p>订阅</p>
                  </div>
                  <Separator
                    className="separator"
                    size="2"
                    orientation="vertical"
                  />
                  <div className="chunk">
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

            {profileData?.authorship.length !== 0 && (
              <div className="pm-podcast-layout">
                <div className="pm-podcast-content">
                  <h3>{renderGender(profileData?.gender)}的播客</h3>

                  {profileData?.authorship.map((item) => (
                    <div
                      className="pm-podcast-item"
                      key={item.pid}
                    >
                      <div className="left">
                        <ColorfulShadow
                          className="episode-cover"
                          curPointer
                          src={item.image.picUrl}
                        />
                      </div>
                      <div className="right">
                        <p>{item.title}</p>
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
              <div className="pm-like-content">
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
                    className="pm-like-item"
                    key={item.id}
                  >
                    <div className="top">
                      <span>{dayjs(item.pickedAt).format('MM/DD')}</span>
                      <span>
                        <span>{item.likeCount}</span>
                        <img
                          src={item.story.iconUrl}
                          alt="like_icon"
                        />
                      </span>
                    </div>
                    <div
                      className="middle"
                      title={item.story.text}
                    >
                      {item.story.text}
                    </div>
                    <Separator
                      my="3"
                      size="4"
                    />
                    <div className="bottom">
                      {item.episode.status === 'REMOVED' ? (
                        <div className="episode-removed">
                          {CONSTANT.EPISODE_STATUS_REMOVED}
                        </div>
                      ) : (
                        <>
                          <div className="left">
                            <ColorfulShadow
                              className="episode-cover"
                              curPointer
                              src={
                                item.episode?.image
                                  ? item.episode.image.picUrl
                                  : item.episode.podcast.image.picUrl
                              }
                              onClick={() => {
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
                          <div className="right">
                            <p>{item.episode.title}</p>
                            <p>{item.episode.podcast.title}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className="pm-sticker-layout">
              <div className="pm-sticker-content">
                <h3>{renderGender(profileData?.gender)}的贴纸库</h3>

                {stickerData.total === 0 ? (
                  <Empty />
                ) : (
                  <Card
                    className="sticker-card"
                    onClick={() => {
                      setStickerModalOpen(true)
                    }}
                  >
                    <div
                      className="sticker-bgi"
                      style={{
                        backgroundImage: `url(${stickerData.total === 0 ? '' : stickerData.records[0].image.picUrl})`,
                      }}
                    />
                    <div>
                      {stickerData.total}张贴纸
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

            <div className="pm-history-content">
              <h3>最近听过</h3>

              {playedLists.length === 0 && <Empty />}

              {playedLists.map((item) => (
                <div
                  className="pm-history-episode-item"
                  key={item.eid}
                >
                  <div className="left">
                    <ColorfulShadow
                      className="episode-cover"
                      curPointer
                      mask
                      src={
                        item.image
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
                  <div className="right">
                    <p>{item.title}</p>
                    <p title={item.description}>{item.description}</p>
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
            </div>
          </div>

          <StickerModal
            stickerLists={stickerData.records}
            perspective={renderGender(profileData?.gender)}
            open={stickerModalOpen}
            onClose={() => {
              setStickerModalOpen(false)
            }}
          />

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
