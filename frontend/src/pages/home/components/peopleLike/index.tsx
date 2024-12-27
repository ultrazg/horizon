import {
  Box,
  Card,
  Flex,
  ScrollArea,
  Avatar,
  HoverCard,
  Skeleton,
} from '@radix-ui/themes'
import { PlayIcon } from '@radix-ui/react-icons'
import './index.modules.scss'
import { ColorfulShadow, ProfileModal } from '@/components'
import { PeopleLikeType } from '@/pages/home'
import React, { useState } from 'react'
import dayjs from 'dayjs'

type IProps = {
  data: PeopleLikeType
  loading: boolean
  onDetail: (pid: string) => void
}

const PeopleLike: React.FC<IProps> = ({ data, loading, onDetail }) => {
  const [profileModal, setProfileModal] = useState<{
    open: boolean
    uid: string
  }>({
    open: false,
    uid: '',
  })

  return (
    <div className="people-like-layout">
      <h3>TA们的喜欢</h3>

      <Skeleton loading={loading}>
        <div className="people-like-content">
          <ScrollArea
            size="2"
            type="hover"
            scrollbars="horizontal"
          >
            <Flex
              gap="3"
              width="700px"
            >
              {/* <div className="card-items"> */}
              {data.map((item) => (
                <Box key={item.pick.id}>
                  <Card className="card">
                    <div className="user-info">
                      <div
                        className="l"
                        onClick={() => {
                          setProfileModal({
                            open: true,
                            uid: item.pick.user.uid,
                          })
                        }}
                      >
                        <Avatar
                          radius="full"
                          size="4"
                          fallback={item.pick.user.nickname}
                          src={item.pick.user.avatar.picture.picUrl}
                        />
                      </div>
                      <div
                        className="m"
                        onClick={() => {
                          setProfileModal({
                            open: true,
                            uid: item.pick.user.uid,
                          })
                        }}
                      >
                        <p>{item.pick.user.nickname}</p>
                        <p>{dayjs(item.pick.pickedAt).format('MM/DD')}</p>
                      </div>
                      <div className="r">
                        {item.pick.likeCount}
                        <img
                          src={item.pick.story.iconUrl}
                          alt="like_icon"
                        />
                      </div>
                    </div>

                    <HoverCard.Root>
                      <HoverCard.Trigger>
                        <div className="comment">{item.pick.story.text}</div>
                      </HoverCard.Trigger>
                      <HoverCard.Content>
                        {item.pick.story.text}
                      </HoverCard.Content>
                    </HoverCard.Root>

                    <div className="episode_info">
                      <div className="l">
                        <ColorfulShadow
                          className="episode_cover"
                          src={
                            item.pick.episode.image?.picUrl
                              ? item.pick.episode.image.picUrl
                              : item.pick.episode.podcast.image.picUrl
                          }
                        />
                      </div>
                      <div className="m">
                        <p title={item.pick.episode.title}>
                          {item.pick.episode.title}
                        </p>
                        <p
                          onClick={() => {
                            onDetail(item.pick.episode.podcast.pid)
                          }}
                        >
                          {item.pick.episode.podcast.title}
                        </p>
                      </div>
                      <div className="r">
                        <div className="play_button">
                          <PlayIcon />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Box>
              ))}
              {/* </div> */}
            </Flex>
          </ScrollArea>
        </div>
      </Skeleton>

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

export default PeopleLike
