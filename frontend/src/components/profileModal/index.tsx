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
import { useDisplayInfo } from '@/hooks'
import './index.modules.scss'
import { ColorfulShadow, MyDropdownMenu, StickerModal } from '@/components'
import {
  SlBubble,
  SlEarphones,
  SlSymbleFemale,
  SlSymbolMale,
} from 'react-icons/sl'
import { getProfile } from '@/api/profile'
import { getUserStats } from '@/api/user'
import { DialogType, ShowMessageDialog, toast } from '@/utils'
import { UserProfileType } from '@/types/profile'
import { renderGender } from '@/utils/string'
import { userStats } from '@/types/user'
import { formatTime } from '@/pages/profile/components/mileageDuration'
import { stickerType } from '@/types/sticker'
import { sticker } from '@/api/sticker'
import { playedList } from '@/api/played'
import { EpisodeType } from '@/types/episode'
import dayjs from 'dayjs'
import { onRelationUpdate } from '@/pages/profile/components/followModal'
import { onBlockedUserCreate } from '@/pages/setting/components/blockedModal'

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
  const [width] = useState<number>(useDisplayInfo().Width * 0.5)
  const [height] = useState<number>(useDisplayInfo().Height * 0.7)
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
        toast('获取用户信息失败')
      })
  }

  /**
   * 拉黑用户
   * @param uid 用户的 uid
   * @param nickname 用户的昵称
   */
  const onBlockHandle = (uid: string, nickname: string) => {
    ShowMessageDialog(
      DialogType.QUESTION,
      '提示',
      `确定要拉黑「${nickname}」吗？`,
    ).then((res) => {
      if (res === 'Yes') {
        onBlockedUserCreate(uid, () => {
          onGetUserStats()
          getUserProfile()
        })
      }
    })
  }

  useEffect(() => {
    if (open) {
      getUserProfile()
      onGetUserStats()
      onGetSticker()
      onGetPlayedList()
    }
  }, [open])

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onClose}
    >
      <Dialog.Content
        style={{ maxWidth: width, height, padding: 0 }}
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
                onClick={onClose}
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
              <div className="pm-ip-loc">IP属地：{profileData?.ipLoc}</div>
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
                  {profileData?.bio || '这个人很懒，什么都没有留下'}
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

            <div className="pm-sticker-layout">
              <div className="pm-sticker-content">
                <h3>{renderGender(profileData?.gender)}的贴纸库</h3>

                <Card
                  className="sticker-card"
                  onClick={() => {
                    setStickerModalOpen(true)
                  }}
                >
                  <div
                    className="sticker-bgi"
                    style={{
                      backgroundImage: `url(${stickerData.records.length === 0 ? '' : stickerData.records[0].image.picUrl})`,
                    }}
                  />
                  <div>
                    {stickerData.total}张贴纸
                    <ChevronRightIcon />
                  </div>
                  <div>
                    最新：
                    {stickerData.records.length === 0
                      ? '-'
                      : stickerData.records[0].name}
                  </div>
                </Card>
              </div>
            </div>

            {/* TODO: TA的喜欢 */}

            <div className="pm-history-content">
              <h3>最近听过</h3>

              {playedLists.length === 0 && (
                <div
                  style={{
                    width: '100%',
                    height: '5rem',
                    color: 'gray',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  暂无数据
                </div>
              )}

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
        </ScrollArea>
      </Dialog.Content>
    </Dialog.Root>
  )
}
