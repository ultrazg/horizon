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
import { toast } from '@/utils'
import { UserProfileType } from '@/types/profile'
import { renderGender } from '@/utils/string'
import { userStats } from '@/types/user'
import { formatTime } from '@/pages/profile/components/mileageDuration'

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

  const avoidDefaultDomBehavior = (e: Event) => {
    e.preventDefault()
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

  useEffect(() => {
    if (open) {
      getUserProfile()
      onGetUserStats()
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
                <MyDropdownMenu.Item>
                  {profileData?.relation === 'FOLLOWING'
                    ? '取消关注'
                    : `关注${renderGender(profileData?.gender)}`}
                </MyDropdownMenu.Item>
                <MyDropdownMenu.Item danger>加入黑名单</MyDropdownMenu.Item>
              </MyDropdownMenu>
            </div>

            <div className="profile-avatar-layout">
              <div className="pm-ip-loc">IP属地：{profileData?.ipLoc}</div>
              <div
                className="background-image"
                style={{
                  background: `url(${profileData?.avatar.picture.picUrl}) no-repeat center center / cover`,
                  filter: 'blur(12px)',
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
                  <div>
                    7张贴纸
                    <ChevronRightIcon />
                  </div>
                  <div>最新：过了一个播客日</div>
                </Card>
              </div>
            </div>

            {/* TODO: TA的喜欢 */}

            <div className="pm-history-content">
              <h3>最近听过</h3>

              <div className="pm-history-episode-item">
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
          </div>

          <StickerModal
            stickerLists={[]}
            perspective="她"
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
