import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
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
  UpdateIcon,
  Pencil2Icon,
  TrashIcon,
} from '@radix-ui/react-icons'
import { IoMdThumbsUp } from 'react-icons/io'
import { useWindowSize, usePlayer } from '@/hooks'
import { CommentReplyModal } from '@/components/playerDrawer/components/commentReplyModal'
import { ProfileModal, CreateCommentModal } from '@/components'
import {
  commentPrimary,
  commentPrimaryType,
  commentCollectCreate,
  type commentCollectCreateType,
  commentLikeUpdate,
  type commentLikeUpdateType,
  type createCommentType,
  createComment,
} from '@/api/comment'
import { CommentPrimaryType } from '@/types/comment'
import { DialogType, ShowMessageDialog, Storage, toast } from '@/utils'
import dayjs from 'dayjs'
import {
  commentCollectRemove,
  type commentCollectRemoveType,
} from '@/api/favorite'
import { isEmpty } from 'lodash'
import HighlightTimeStrings from '@/components/playerDrawer/components/highlightTimeStrings'
import { onRemoveCommentFunc } from '@/components/playerDrawer/components/commentReplyModal'

type IProps = {
  open: boolean
  eid: string
}

type onCommentLikeUpdateFn = (
  params: commentLikeUpdateType,
  cb?: () => void,
) => void

/**
 * 点赞、取消点赞评论
 * @param params
 * @param cb
 */
export const onCommentLikeUpdate: onCommentLikeUpdateFn = (params, cb) => {
  commentLikeUpdate(params)
    .then(() => cb && cb())
    .catch(() => {
      toast('操作失败', { type: 'warn' })
    })
}

export const EpisodeComment: React.FC<IProps> = ({ eid, open }) => {
  const player = usePlayer()
  const [height] = React.useState<number>(useWindowSize().height - 35)
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
  const [CCM, setCCM] = useState<{
    open: boolean
    loading: boolean
  }>({
    open: false,
    loading: false,
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

  const onSendComment = (text: string) => {
    const params: createCommentType = {
      text,
      id: eid,
      type: 'EPISODE',
    }

    setCCM({
      ...CCM,
      loading: true,
    })

    createComment(params)
      .then((res) => {
        toast(res.data.toast, {
          type: 'success',
        })

        if (commentData.records[0].pinned) {
          setCommentData({
            ...commentData,
            records: [
              commentData.records[0],
              res.data.data,
              ...commentData.records.slice(1),
            ],
          })
        } else {
          setCommentData({
            ...commentData,
            records: [res.data.data, ...commentData.records],
          })
        }
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setCCM({
          open: false,
          loading: false,
        })
      })
  }

  /**
   * 收藏评论
   * @param commentId 评论 id
   */
  const onCommentCollectCreate = (commentId: string) => {
    const params: commentCollectCreateType = {
      commentId,
    }

    commentCollectCreate(params).then((res) => {
      toast(res.data.toast, { type: 'success' })

      const temp: CommentPrimaryType[] = commentData.records.map((item) => {
        if (item.id === commentId) {
          return {
            ...item,
            collected: true,
          }
        }

        return item
      })

      setCommentData({
        ...commentData,
        records: temp,
      })
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
        const params: commentCollectRemoveType = {
          commentId,
        }

        commentCollectRemove(params)
          .then((res) => {
            toast(res.data.toast, { type: 'success' })

            const temp: CommentPrimaryType[] = commentData.records.map(
              (item) => {
                if (item.id === commentId) {
                  return {
                    ...item,
                    collected: false,
                  }
                }

                return item
              },
            )

            setCommentData({
              ...commentData,
              records: temp,
            })
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
      <div className={styles['player-comment-layout']}>
        <Text
          size="5"
          style={{ fontWeight: 'bold' }}
        >
          {commentData.total} 条评论
          <Tooltip content={'刷新评论'}>
            <IconButton
              color={'gray'}
              ml={'3'}
              mr={'3'}
              size={'1'}
              onClick={() => {
                getComment()
              }}
            >
              <UpdateIcon />
            </IconButton>
          </Tooltip>
          <Tooltip content={'添加评论'}>
            <IconButton
              size="1"
              color={'gray'}
              onClick={() => {
                setCCM({
                  ...CCM,
                  open: true,
                })
              }}
            >
              <Pencil2Icon />
            </IconButton>
          </Tooltip>
        </Text>

        <ScrollArea
          type="hover"
          scrollbars="vertical"
          style={{ height: `${height - 100}px` }}
        >
          <div className={styles['player-comment-content']}>
            {commentData.records.map((item) => (
              <div
                key={item.id}
                className={styles['player-comment-item']}
              >
                <div className={styles['player-comment-author']}>
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
                      {dayjs(item.collectedAt).format('YYYY/MM/DD')}
                      <span className={styles['ip']}>
                        IP属地：{item.author.ipLoc}
                      </span>
                    </p>
                  </div>
                  <div
                    className={styles['player-comment-more-action']}
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

                  {item.author.uid === Storage.get('user_info').uid && (
                    <div>
                      <Tooltip content={'删除评论'}>
                        <IconButton
                          variant="ghost"
                          size="1"
                          style={{ color: '#EB8E90' }}
                          mr="3"
                          onClick={() => {
                            ShowMessageDialog(
                              DialogType.QUESTION,
                              '提示',
                              '确定删除这条评论吗？',
                            ).then((res) => {
                              if (res === 'Yes' || res === '是') {
                                onRemoveCommentFunc(item.id, () => {
                                  const temp: CommentPrimaryType[] =
                                    commentData.records.filter(
                                      (i) => i.id !== item.id,
                                    )

                                  setCommentData({
                                    ...commentData,
                                    records: temp,
                                  })
                                })
                              }
                            })
                          }}
                        >
                          <TrashIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}

                  <div
                    style={item.liked ? { color: 'red' } : { color: 'gray' }}
                    onClick={() => {
                      onCommentLikeUpdate(
                        { type: 'COMMENT', id: item.id, liked: !item.liked },
                        () => {
                          const temp: CommentPrimaryType[] =
                            commentData.records.map((itm) => {
                              if (itm.id === item.id) {
                                return {
                                  ...itm,
                                  liked: !itm.liked,
                                  likeCount:
                                    itm.likeCount + (itm.liked ? -1 : 1),
                                }
                              }

                              return itm
                            })

                          setCommentData({
                            ...commentData,
                            records: temp,
                          })
                        },
                      )
                    }}
                  >
                    <IoMdThumbsUp />
                    {item.likeCount === 0 ? null : item.likeCount}
                  </div>
                </div>
                <div className={styles['player-comment-body']}>
                  {item.pinned && (
                    <Badge
                      color="violet"
                      mr="2"
                    >
                      置顶
                    </Badge>
                  )}

                  {/* TODO: 处理语音评论 */}

                  {item.text && (
                    <HighlightTimeStrings
                      text={item.text}
                      player={player}
                    />
                  )}
                </div>
                {item.replies && item.replies.length > 0 && (
                  <div className={styles['player-comment-replies']}>
                    {item.replies.map((itm) => (
                      <div
                        key={itm.id}
                        className={styles['player-comment-reply']}
                        title={`${itm.author.nickname}：${itm.text}`}
                      >
                        <span
                          className={styles['player-comment-reply-nickname']}
                        >
                          {itm.author.nickname}
                        </span>
                        ：{itm.text}
                      </div>
                    ))}

                    {item.threadReplyCount > 2 && (
                      <div
                        className={styles['player-comment-more-reply']}
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
              <div className={styles['load-more-button']}>
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
        eid={eid}
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

      <CreateCommentModal
        loading={CCM.loading}
        open={CCM.open}
        onOk={(text) => {
          onSendComment(text)
        }}
        onClose={() => {
          setCCM({
            open: false,
            loading: false,
          })
        }}
      />
    </>
  )
}
