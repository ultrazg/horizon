import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  IconButton,
  ScrollArea,
  Slider,
  Text,
  Tooltip,
} from '@radix-ui/themes'
import { CaretDownIcon, StarIcon } from '@radix-ui/react-icons'
import { useDisplayInfo } from '@/hooks'
import { CoverBox } from './components/coverBox'
import { LiveCount } from './components/liveCount'
import { CommentReplyModal } from './components/commentReplyModal'
import { ProfileModal } from '@/components'
import './index.modules.scss'
import {
  BsPlayFill,
  BsSkipBackwardFill,
  BsSkipForwardFill,
} from 'react-icons/bs'
import { IoMdThumbsUp, IoMdInformationCircleOutline } from 'react-icons/io'
import { episodeDetail } from '@/api/episode'
import { EpisodeType } from '@/types/episode'
import { showEpisodeDetailModal, toast } from '@/utils'

type IProps = {
  eid: string
  open: boolean
  onClose: () => void
}

export const Player: React.FC<IProps> = ({ eid, open, onClose }) => {
  const [height] = React.useState<number>(useDisplayInfo().Height - 35)
  const [width] = React.useState<number>(useDisplayInfo().Width)
  const [replyModal, setReplyModal] = useState<{ id: string; open: boolean }>({
    id: '0',
    open: false,
  })
  const [profileModal, setProfileModal] = useState<{
    open: boolean
    uid: string
  }>({
    open: false,
    uid: '',
  })
  const [episodeDetailInfo, setEpisodeDetailInfo] = useState<EpisodeType>()

  const count = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  const onViewReply = () => {
    setReplyModal({
      id: '123',
      open: true,
    })
  }

  const getEpisodeDetail = () => {
    const params = {
      eid,
    }

    episodeDetail(params)
      .then((res) => {
        setEpisodeDetailInfo(res.data.data)
      })
      .catch(() => {
        toast('获取单集详情失败', { type: 'warn' })
      })
  }

  useEffect(() => {
    if (open) {
      getEpisodeDetail()
    }
  }, [open])

  return (
    <div
      style={{
        width,
        height,
        transform: open
          ? `translateY(-${height}px)`
          : `translateY(${height}px)`,
      }}
      className="player-drawer-layout"
    >
      <div
        className="player-background-image"
        style={{
          background: `url(${episodeDetailInfo?.image ? episodeDetailInfo.image.picUrl : episodeDetailInfo?.podcast.image.picUrl}) no-repeat center center / cover`,
        }}
      />

      <div className="close-button">
        <IconButton
          onClick={onClose}
          variant="ghost"
          mt="1"
          color="gray"
          radius="full"
        >
          <CaretDownIcon
            width={30}
            height={30}
          />
        </IconButton>
        <LiveCount
          open={open}
          eid={eid}
        />
      </div>

      <div
        className="player-content"
        style={{ height: `${height - 80}px` }}
      >
        <div className="player-left">
          <div className="player-left-content">
            <CoverBox
              open={open}
              episodeCover={
                episodeDetailInfo?.image
                  ? episodeDetailInfo.image.picUrl
                  : episodeDetailInfo?.podcast.image.picUrl
              }
              podcastCover={episodeDetailInfo?.podcast.image.picUrl}
            />
            <Text
              as="p"
              size="7"
              mt="4"
              mb="1"
              align="center"
              className="episode-name"
            >
              {episodeDetailInfo?.title}
            </Text>
            <Text
              as="p"
              align="center"
              size="5"
              mb="6"
              className="podcast-name"
            >
              {episodeDetailInfo?.podcast.title}
            </Text>

            <div className="control-button-layout">
              <div>
                <Tooltip content="单集详情">
                  <IconButton
                    variant="ghost"
                    radius="large"
                    className="control-button"
                    onClick={() => {
                      showEpisodeDetailModal(eid)
                    }}
                  >
                    <IoMdInformationCircleOutline />
                  </IconButton>
                </Tooltip>

                <Tooltip content="向后15秒">
                  <IconButton
                    variant="ghost"
                    radius="large"
                    className="control-button"
                  >
                    <BsSkipBackwardFill />
                  </IconButton>
                </Tooltip>

                <Tooltip content="播放">
                  <IconButton
                    variant="ghost"
                    radius="large"
                    className="control-button"
                  >
                    <BsPlayFill />
                  </IconButton>
                </Tooltip>

                <Tooltip content="向前15秒">
                  <IconButton
                    variant="ghost"
                    radius="large"
                    className="control-button"
                  >
                    <BsSkipForwardFill />
                  </IconButton>
                </Tooltip>

                <Tooltip content="标记精彩时刻">
                  <IconButton
                    variant="ghost"
                    radius="large"
                    className="control-button"
                  >
                    <IoMdThumbsUp />
                  </IconButton>
                </Tooltip>
              </div>
            </div>

            <div className="progress-bar-layout">
              <div className="time-flag">
                <span>16:58</span>
                <span>1:41:11</span>
              </div>
              <div className="progress-bar">
                <Slider
                  size="1"
                  radius="none"
                  defaultValue={[30]}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="player-right">
          <div className="player-comment-layout">
            <Text
              size="5"
              style={{ fontWeight: 'bold' }}
            >
              1055 条评论
            </Text>

            <ScrollArea
              type="always"
              scrollbars="vertical"
              style={{ height: `${height - 100}px` }}
            >
              <div className="player-comment-content">
                {count.map((item: any) => (
                  <div
                    key={item}
                    className="player-comment-item"
                  >
                    <div className="player-comment-author">
                      <div
                        onClick={() => {
                          setProfileModal({
                            open: true,
                            uid: '123',
                          })
                        }}
                      >
                        <Avatar
                          radius="full"
                          src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                          fallback="A"
                        />
                      </div>
                      <div>
                        <span
                          onClick={() => {
                            setProfileModal({
                              open: true,
                              uid: '123',
                            })
                          }}
                        >
                          不开玩笑小助手
                        </span>
                        <p>
                          10/23 <span>上海</span>
                        </p>
                      </div>
                      <div className="player-comment-more-action">
                        <Tooltip content="收藏评论">
                          <IconButton
                            variant="ghost"
                            size="1"
                            color="gray"
                            onClick={() => {
                              // ...
                            }}
                          >
                            <StarIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                      <div>
                        <IoMdThumbsUp />
                        23
                      </div>
                    </div>
                    <div className="player-comment-body">
                      窦娥在刑场即将行刑时 看着漫天的大雪 哭诉道：“冤深，启冻！”
                      后人都称：万冤深导致的 后人悲呼：万冤身亡的
                      商鞅：原来你也万冤身 有人觉得窦娥不怨
                      对此我想说：冤身怎么你了？
                    </div>
                    <div className="player-comment-replies">
                      <div className="player-comment-reply">
                        <span
                          className="player-comment-reply-nickname"
                          onClick={() => {
                            setProfileModal({
                              open: true,
                              uid: '123',
                            })
                          }}
                        >
                          推阿婆下楼
                        </span>
                        ：原神怎么你了？😡
                      </div>
                      <div className="player-comment-reply">
                        <span className="player-comment-reply-nickname">
                          想吃羊肉串儿
                        </span>
                        ：说到我心坎儿里说到我心坎儿里说到我心坎儿里说到我心坎儿里
                      </div>
                      <div
                        className="player-comment-more-reply"
                        onClick={() => {
                          onViewReply()
                        }}
                      >
                        共 3 条回复 &gt;
                      </div>
                    </div>
                  </div>
                ))}

                <div className="load-more-button">
                  <Button
                    variant="ghost"
                    color="gray"
                  >
                    加载更多
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      <CommentReplyModal
        id={replyModal.id}
        open={replyModal.open}
        onClose={() => {
          setReplyModal({
            id: '0',
            open: false,
          })
        }}
      />

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
