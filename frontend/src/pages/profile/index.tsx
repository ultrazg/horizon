import React, { useEffect, useState } from 'react'
import { Avatar, Flex, Separator } from '@radix-ui/themes'
import { SlSymbleFemale, SlSymbolMale } from 'react-icons/sl'
import { useNavigateTo } from '@/hooks'
import { FollowModal } from './components/followModal'
import { MileageDuration } from './components/mileageDuration'
import { Sticker } from './components/sticker'
import { Storage } from '@/utils'
import { userType, userStats } from '@/types/user'
import { getUserStats } from '@/api/user'
import { PlayedList } from './components/playedList'
import './index.modules.scss'

export const Profile: React.FC = () => {
  const userInfo: userType = Storage.get('user_info')
  const [followModal, setFollowModal] = useState<{
    uid: string
    type: 'FOLLOWING' | 'FOLLOWER'
    open: boolean
  }>({
    uid: '',
    type: 'FOLLOWING',
    open: false,
  })
  const [stats, setStats] = useState<userStats>({
    followerCount: 0,
    followingCount: 0,
    subscriptionCount: 0,
    totalPlayedSeconds: 0,
  })
  const goMySubscribe = useNavigateTo('/subscription')
  const onFollowHandle = (type: 'FOLLOWING' | 'FOLLOWER') => {
    setFollowModal({
      uid: userInfo.uid,
      type,
      open: true,
    })
  }

  /**
   * 获取用户统计数据
   */
  const onGetUserStats = () => {
    const params = {
      uid: userInfo.uid,
    }

    getUserStats(params)
      .then((res) => setStats(res.data.data))
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    onGetUserStats()
  }, [])

  return (
    <div className="profile-layout">
      <div className="profile-content">
        <div className="profile-avatar">
          <Avatar
            size="9"
            src={userInfo.avatar}
            fallback={userInfo.nickname || 'avatar'}
            radius="full"
          />
        </div>
        <div className="profile-info">
          <div className="profile-nickname">
            {userInfo.nickname}
            <span className="gender">
              {userInfo?.gender === 'MALE' ? (
                <SlSymbolMale
                  fontSize="18"
                  color="royalblue"
                />
              ) : null}
              {userInfo?.gender === 'FEMALE' ? (
                <SlSymbleFemale
                  fontSize="18"
                  color="pink"
                />
              ) : null}
            </span>
          </div>
          <Separator
            my="1"
            size="4"
          />
          <div className="profile-follow">
            <Flex
              gap="3"
              align="center"
            >
              <div
                className="chunk"
                onClick={() => {
                  onFollowHandle('FOLLOWING')
                }}
              >
                <p>{stats.followingCount}</p>
                <p>关注</p>
              </div>
              <Separator
                className="separator"
                size="2"
                orientation="vertical"
              />
              <div
                className="chunk"
                onClick={() => {
                  onFollowHandle('FOLLOWER')
                }}
              >
                <p>{stats.followerCount}</p>
                <p>粉丝</p>
              </div>
              <Separator
                className="separator"
                size="2"
                orientation="vertical"
              />
              <div
                className="chunk"
                onClick={() => {
                  goMySubscribe()
                }}
              >
                <p>{stats.subscriptionCount}</p>
                <p>订阅</p>
              </div>
            </Flex>
          </div>
          <div className="profile-bio">{userInfo.bio || '还没有设置签名'}</div>
          <div className="profile-ip">IP属地：{userInfo.ipLoc}</div>
        </div>
      </div>

      <MileageDuration />

      <Sticker />

      <PlayedList />

      <FollowModal
        uid={followModal.uid}
        type={followModal.type}
        open={followModal.open}
        onClose={() => {
          setFollowModal({
            uid: '',
            type: 'FOLLOWING',
            open: false,
          })
          onGetUserStats()
        }}
      />
    </div>
  )
}
