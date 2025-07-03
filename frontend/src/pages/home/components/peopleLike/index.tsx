import { Box, Card, Flex, ScrollArea, Avatar, Skeleton } from '@radix-ui/themes'
import { PlayIcon } from '@radix-ui/react-icons'
import './index.modules.scss'
import { ColorfulShadow, ProfileModal } from '@/components'
import { PeopleLikeType } from '@/pages/home'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import { showEpisodeDetailModal } from '@/utils'
import { usePlayer } from '@/hooks'
import { PlayerEpisodeInfoType } from '@/utils/player'

type IProps = {
  data: PeopleLikeType
  loading: boolean
  onDetail: (pid: string) => void
}

const PeopleLike: React.FC<IProps> = ({ data, loading, onDetail }) => {
  const player = usePlayer()
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
            style={{ paddingBottom: 20 }}
          >
            <Flex
              gap="3"
              width="700px"
            >
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

                    <div
                      className="comment"
                      title={item.pick.story.text}
                    >
                      {item.pick.story.text}
                    </div>

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
                        <p
                          onClick={() => {
                            showEpisodeDetailModal(item.pick.episode.eid)
                          }}
                          title={item.pick.episode.title}
                        >
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
                      <div
                        className="r"
                        onClick={() => {
                          const episodeInfo: PlayerEpisodeInfoType = {
                            title: item.pick.episode.title,
                            eid: item.pick.episode.eid,
                            pid: item.pick.episode.podcast.pid,
                            cover: item.pick.episode?.image
                              ? item.pick.episode.image.picUrl
                              : item.pick.episode.podcast.image.picUrl,
                            liked: item.pick.episode.isFavorited,
                          }

                          player.load(
                            item.pick.episode.media.source.url,
                            episodeInfo,
                          )
                          player.play()
                        }}
                      >
                        <div className="play_button">
                          <PlayIcon />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Box>
              ))}
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
