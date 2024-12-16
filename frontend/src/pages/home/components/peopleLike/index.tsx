import {
  Box,
  Card,
  Flex,
  ScrollArea,
  Avatar,
  HoverCard,
} from '@radix-ui/themes'
import { HeartFilledIcon, PlayIcon } from '@radix-ui/react-icons'
import './index.modules.scss'
import { ColorfulShadow } from '@/components'
import { PeopleLikeType } from '@/pages/home'
import React, { useEffect } from 'react'
import dayjs from 'dayjs'

type IProps = {
  data: PeopleLikeType
  loading: boolean
}

const PeopleLike: React.FC<IProps> = ({ data, loading }) => {
  return (
    <div className="people-like-layout">
      <h3>TA们的喜欢</h3>

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
                      <p>{item.pick.episode.podcast.title}</p>
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
    </div>
  )
}

export default PeopleLike
