import React, { useEffect, useState } from 'react'
import './index.modules.scss'
import {
  Avatar,
  Badge,
  Button,
  IconButton,
  ScrollArea,
  Text,
  Tooltip,
} from '@radix-ui/themes'
import {
  HeartFilledIcon,
  HeartIcon,
  ChatBubbleIcon,
} from '@radix-ui/react-icons'
import { IoMdThumbsUp } from 'react-icons/io'
import { useDisplayInfo, usePlayer } from '@/hooks'
import { CommentReplyModal } from '@/components/playerDrawer/components/commentReplyModal'
import { ProfileModal } from '@/components'
import {
  commentPrimary,
  commentPrimaryType,
  commentCollectCreate,
  commentLikeUpdate,
} from '@/api/comment'
import { CommentPrimaryType } from '@/types/comment'
import { DialogType, ShowMessageDialog, toast } from '@/utils'
import dayjs from 'dayjs'
import { commentCollectRemove } from '@/api/favorite'
import { isEmpty } from 'lodash'
import HighlightTimeStrings from '@/components/playerDrawer/components/highlightTimeStrings'

type IProps = {
  open: boolean
  eid: string
}

/**
 * 点赞、取消点赞评论
 * @param commentId
 * @param liked
 * @param cb
 */
export const onCommentLikeUpdate = (
  commentId: string,
  liked: boolean,
  cb: () => void,
) => {
  const params = {
    id: commentId,
    liked,
  }

  commentLikeUpdate(params)
    .then(() => cb())
    .catch(() => {
      toast('操作失败', { type: 'warn' })
    })
}

export const EpisodeComment: React.FC<IProps> = ({ eid, open }) => {
  const player = usePlayer()
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
  const [loadMoreKey, setLoadMoreKey] = useState<any>({})
  const [replyModal, setReplyModal] = useState<{
    primaryComment: CommentPrimaryType | any
    open: boolean
  }>({
    primaryComment: {},
    open: false,
  })

  const getComment = (loadMoreKey?: {}) => {
    setLoading(true)

    const params: commentPrimaryType = {
      id: eid,
      order: 'HOT',
      loadMoreKey,
    }

    commentPrimary(params)
      .then((res) => {
        if (isEmpty(loadMoreKey)) {
          setCommentData({
            total: res.data.totalCount,
            records: res.data.data,
          })
        } else {
          setCommentData({
            total: res.data.totalCount,
            records: [...commentData.records, ...res.data.data],
          })
        }

        if (res.data?.loadMoreKey) {
          setLoadMoreKey(res.data.loadMoreKey)
        }
      })
      .catch(() => {
        toast('获取单集评论失败', { type: 'warn' })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  /**
   * 收藏评论
   * @param commentId 评论 id
   */
  const onCommentCollectCreate = (commentId: string) => {
    const params = {
      commentId,
    }

    commentCollectCreate(params).then((res) => {
      toast(res.data.toast, { type: 'success' })
      getComment()
    })
  }

  /**
   * 删除收藏的评论
   * @param commentId 评论 id
   */
  const onCommentCollectRemove = (commentId: string) => {
    ShowMessageDialog(
      DialogType.QUESTION,
      '提示',
      '确定要取消收藏这条评论吗？',
    ).then((res) => {
      if (res === 'Yes' || res === '是') {
        const params = {
          commentId,
        }

        commentCollectRemove(params)
          .then((res) => {
            toast(res.data.toast, { type: 'success' })
            getComment()
          })
          .catch(() => {
            toast('操作失败', { type: 'warn' })
          })
      }
    })
  }

  useEffect(() => {
    if (open) {
      getComment()
    }

    return () => {
      setCommentData({
        total: 0,
        records: [],
      })
    }
  }, [open])

  return (
    <>
      <div className="player-comment-layout">
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

                      {item.badges.length > 0
                        ? item.badges.map((itm) => (
                            <img
                              key={itm.icon.picUrl}
                              style={{
                                width: itm.icon.width * 0.4,
                                height: itm.icon.height * 0.4,
                              }}
                              title={itm.tip}
                              src={itm.icon.picUrl}
                              alt="badge"
                            />
                          ))
                        : null}
                    </span>
                    <p>
                      {dayjs(item.collectedAt).format('YYYY/MM/DD')}{' '}
                      <span>IP属地：{item.author.ipLoc}</span>
                    </p>
                  </div>
                  <div
                    className="player-comment-more-action"
                    style={item.collected ? { opacity: 1 } : {}}
                  >
                    <span>
                      <IconButton
                        variant="ghost"
                        size="1"
                        color="gray"
                        mr="1"
                        onClick={() => {
                          setReplyModal({
                            primaryComment: item,
                            open: true,
                          })
                        }}
                      >
                        <ChatBubbleIcon />
                      </IconButton>
                      {item?.replyCount === 0 ? null : item?.replyCount}
                    </span>

                    <Tooltip content={item.collected ? '取消收藏' : '收藏评论'}>
                      <IconButton
                        variant="ghost"
                        size="1"
                        color="gray"
                        ml="3"
                        onClick={() => {
                          if (item.collected) {
                            onCommentCollectRemove(item.id)
                          } else {
                            onCommentCollectCreate(item.id)
                          }
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
                  <div
                    style={item.liked ? { color: 'red' } : { color: 'gray' }}
                    onClick={() => {
                      onCommentLikeUpdate(item.id, !item.liked, getComment)
                    }}
                  >
                    <IoMdThumbsUp />
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

                  <HighlightTimeStrings
                    text={item.text}
                    player={player}
                  />
                </div>
                {item.replies && item.replies.length > 0 && (
                  <div className="player-comment-replies">
                    {item.replies.map((itm) => (
                      <div
                        key={itm.id}
                        className="player-comment-reply"
                        title={`${itm.author.nickname}：${itm.text}`}
                      >
                        <span className="player-comment-reply-nickname">
                          {itm.author.nickname}
                        </span>
                        ：{itm.text}
                      </div>
                    ))}

                    {item.threadReplyCount > 2 && (
                      <div
                        className="player-comment-more-reply"
                        onClick={() => {
                          setReplyModal({
                            primaryComment: item,
                            open: true,
                          })
                        }}
                      >
                        共 {item.threadReplyCount} 条回复 &gt;
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {!isEmpty(loadMoreKey) && (
              <div className="load-more-button">
                <Button
                  variant="soft"
                  color="gray"
                  onClick={() => {
                    getComment(loadMoreKey)
                  }}
                  loading={loading}
                >
                  加载更多
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <CommentReplyModal
        primaryComment={replyModal.primaryComment}
        open={replyModal.open}
        onClose={() => {
          setReplyModal({
            primaryComment: {},
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
