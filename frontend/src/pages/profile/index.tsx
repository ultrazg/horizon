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
import styles from './index.module.scss'

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
    <div className={styles['profile-layout']}>
      <div className={styles['profile-content']}>
        <div className={styles['profile-avatar']}>
          <Avatar
            size="9"
            src={userInfo.avatar}
            fallback={userInfo.nickname || 'avatar'}
            radius="full"
          />
        </div>
        <div className={styles['profile-info']}>
          <div className={styles['profile-nickname']}>
            {userInfo.nickname}
            <span className={styles['gender']}>
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
            <span className={styles['profile-ip']}>
              IP属地：{userInfo.ipLoc || '未知'}
            </span>
          </div>
          <Separator
            my="1"
            size="4"
          />
          <div className={styles['profile-follow']}>
            <Flex
              gap="3"
              align="center"
            >
              <div
                className={styles['chunk']}
                onClick={() => {
                  onFollowHandle('FOLLOWING')
                }}
              >
                <p>{stats.followingCount}</p>
                <p>关注</p>
              </div>
              <Separator
                className={styles['separator']}
                size="2"
                orientation="vertical"
              />
              <div
                className={styles['chunk']}
                onClick={() => {
                  onFollowHandle('FOLLOWER')
                }}
              >
                <p>{stats.followerCount}</p>
                <p>粉丝</p>
              </div>
              <Separator
                className={styles['separator']}
                size="2"
                orientation="vertical"
              />
              <div
                className={styles['chunk']}
                onClick={() => {
                  goMySubscribe()
                }}
              >
                <p>{stats.subscriptionCount}</p>
                <p>订阅</p>
              </div>
            </Flex>
          </div>
          <div className={styles['profile-bio']}>
            {userInfo.bio || '还没有设置签名'}
          </div>
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
