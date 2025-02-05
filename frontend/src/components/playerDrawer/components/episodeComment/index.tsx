import React, { useEffect, useState } from 'react'
import './index.modules.scss'
import {
  Avatar,
  Badge,
  Button,
  IconButton,
  ScrollArea,
  Spinner,
  Text,
  Tooltip,
} from '@radix-ui/themes'
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import { IoMdThumbsUp } from 'react-icons/io'
import { useDisplayInfo } from '@/hooks'
import { CommentReplyModal } from '@/components/playerDrawer/components/commentReplyModal'
import { ProfileModal } from '@/components'
import { commentPrimary, commentPrimaryType } from '@/api/comment'
import { CommentPrimaryType } from '@/types/comment'
import { toast } from '@/utils'
import dayjs from 'dayjs'

type IProps = {
  open: boolean
  eid: string
}

export const EpisodeComment: React.FC<IProps> = ({ eid, open }) => {
  const [height] = React.useState<number>(useDisplayInfo().Height - 35)
  const [loading, setLoading] = useState<boolean>(false)
  const [commentData, setCommentData] = useState<{
    total: number
    records: CommentPrimaryType[]
  }>({
    total: 0,
    records: [],
  })
  const [profileModal, setProfileModal] = useState<{
    open: boolean
    uid: string
  }>({
    open: false,
    uid: '',
  })
  const [replyModal, setReplyModal] = useState<{ id: string; open: boolean }>({
    id: '0',
    open: false,
  })

  const getComment = () => {
    setLoading(true)

    const params: commentPrimaryType = {
      id: eid,
      order: 'HOT',
    }

    commentPrimary(params)
      .then((res) => {
        setCommentData({
          total: res.data.totalCount,
          records: res.data.data,
        })
      })
      .catch(() => {
        toast('获取单集评论失败', { type: 'warn' })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onViewReply = () => {
    setReplyModal({
      id: '123',
      open: true,
    })
  }

  useEffect(() => {
    if (open) {
      getComment()
    }
  }, [open])

  return (
    <>
      <div className="player-comment-layout">
        <Spinner loading={loading}>
          <Text
            size="5"
            style={{ fontWeight: 'bold' }}
          >
            {commentData.total} 条评论
          </Text>

          <ScrollArea
            type="always"
            scrollbars="vertical"
            style={{ height: `${height - 100}px` }}
          >
            <div className="player-comment-content">
              {commentData.records.map((item) => (
                <div
                  key={item.id}
                  className="player-comment-item"
                >
                  <div className="player-comment-author">
                    <div
                      onClick={() => {
                        setProfileModal({
                          open: true,
                          uid: item.author.uid,
                        })
                      }}
                    >
                      <Avatar
                        radius="full"
                        src={item.author.avatar.picture.picUrl}
                        fallback="AVATAR"
                      />
                    </div>
                    <div>
                      <span
                        onClick={() => {
                          setProfileModal({
                            open: true,
                            uid: item.author.uid,
                          })
                        }}
                      >
                        {item.author.nickname}
                      </span>
                      <p>
                        {dayjs(item.collectedAt).format('YYYY/MM/DD')}{' '}
                        <span>{item.author.ipLoc}</span>
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
                          {item.collected ? (
                            <HeartFilledIcon color="red" />
                          ) : (
                            <HeartIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div>
                      <IoMdThumbsUp color={item.liked ? 'white' : 'gray'} />
                      {item.likeCount}
                    </div>
                  </div>
                  <div className="player-comment-body">
                    {item.pinned && (
                      <Badge
                        color="violet"
                        mr="2"
                      >
                        置顶
                      </Badge>
                    )}

                    {item.text}
                  </div>
                  {item.replies && item.replies.length > 0 && (
                    <div className="player-comment-replies">
                      {item.replies.map((itm) => (
                        <div className="player-comment-reply">
                          <span
                            className="player-comment-reply-nickname"
                            onClick={() => {
                              setProfileModal({
                                open: true,
                                uid: itm.author.uid,
                              })
                            }}
                          >
                            {itm.author.nickname}
                          </span>
                          ：{itm.text}
                        </div>
                      ))}

                      {item.threadReplyCount > 2 && (
                        <div
                          className="player-comment-more-reply"
                          onClick={() => {
                            onViewReply()
                          }}
                        >
                          共 {item.threadReplyCount} 条回复 &gt;
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <div className="load-more-button">
                <Button
                  variant="soft"
                  color="gray"
                >
                  加载更多
                </Button>
              </div>
            </div>
          </ScrollArea>
        </Spinner>
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
    </>
  )
}
