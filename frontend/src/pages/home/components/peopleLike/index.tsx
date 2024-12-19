import {
  Box,
  Card,
  Flex,
  ScrollArea,
  Avatar,
  HoverCard,
  Skeleton,
} from '@radix-ui/themes'
import { HeartFilledIcon, PlayIcon } from '@radix-ui/react-icons'
import './index.modules.scss'
import { ColorfulShadow } from '@/components'
import { PeopleLikeType } from '@/pages/home'
import React from 'react'
import dayjs from 'dayjs'

type IProps = {
  data: PeopleLikeType
  loading: boolean
  onDetail: (pid: string) => void
}

const PeopleLike: React.FC<IProps> = ({ data, loading, onDetail }) => {
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
                      <div className="l">
                        <Avatar
                          radius="full"
                          size="4"
                          fallback
                          src={item.pick.user.avatar.picture.picUrl}
                        />
                      </div>
                      <div className="m">
                        <p>{item.pick.user.nickname}</p>
                        <p>{dayjs(item.pick.pickedAt).format('MM/DD')}</p>
                      </div>
                      <div className="r">
                        <HeartFilledIcon />
                        {item.pick.likeCount}
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
    </div>
  )
}

export default PeopleLike
