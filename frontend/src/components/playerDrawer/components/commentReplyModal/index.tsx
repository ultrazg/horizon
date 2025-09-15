import React, { useEffect, useState } from 'react'
import { Empty, Modal, ProfileModal, CreateCommentModal } from '@/components'
import { modalType } from '@/types/modal'
import styles from './index.module.scss'
import {
  Avatar,
  Button,
  ScrollArea,
  Spinner,
  Text,
  TextField,
  Tooltip,
} from '@radix-ui/themes'
import { usePlayer, useWindowSize } from '@/hooks'
import { IoMdThumbsUp, IoMdTrash } from 'react-icons/io'
import {
  commentThread,
  commentThreadType,
  createComment,
  type createCommentType,
  removeComment,
} from '@/api/comment'
import { CommentPrimaryType } from '@/types/comment'
import dayjs from 'dayjs'
import { DialogType, ShowMessageDialog, Storage, toast } from '@/utils'
import { onCommentLikeUpdate } from '@/components/playerDrawer/components/episodeComment'
import { PaperPlaneIcon, Pencil2Icon } from '@radix-ui/react-icons'
import VoiceComment from '@/components/playerDrawer/components/voiceComment'

type IProps = {
  eid: string
  primaryComment: CommentPrimaryType
} & modalType

/**
 * 删除评论
 * @param commentId
 * @param cb
 */
export const onRemoveCommentFunc = (commentId: string, cb?: () => void) => {
  removeComment({ commentId })
    .then((res) => {
      toast(res.data.toast, { type: 'success' })
      cb?.()
    })
    .catch((err) => {
      console.error(err)
    })
}

/**
 * 评论回复弹窗
 * @param eid
 * @param primaryComment
 * @param open 是否打开
 * @param onClose 关闭弹窗
 * @constructor
 */
export const CommentReplyModal: React.FC<IProps> = ({
  eid,
  primaryComment,
  open,
  onClose,
}) => {
  const [height] = React.useState<number>(useWindowSize().height)
  const [loading, setLoading] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [replyLoading, setReplyLoading] = useState<boolean>(false)
  const [threadCommentData, setThreadCommentData] = useState<{
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
  const [text, setText] = useState<string>('')
  const [CCM, setCCM] = useState<{
    open: boolean
    replyTo: string
    replyToCommentId: string
  }>({
    open: false,
    replyTo: '',
    replyToCommentId: '',
  })
  const player = usePlayer()

  const onSendComment = (
    replyToCommentId: string,
    content?: string,
    cb?: () => void,
  ) => {
    const params: createCommentType = {
      text: content || text,
      replyToCommentId,
      id: eid,
      type: 'EPISODE',
    }

    if (content) {
      setReplyLoading(true)
    } else {
      setSubmitLoading(true)
    }

    createComment(params)
      .then((res) => {
        toast(res.data.toast, {
          type: 'success',
        })
        cb?.()
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setReplyLoading(false)
        setSubmitLoading(false)
      })
  }

  /**
   * 查询回复评论详情
   */
  const getThreadComment = () => {
    setLoading(true)

    const params: commentThreadType = {
      primaryCommentId: primaryComment.id,
      order: 'SMART',
    }

    commentThread(params)
      .then((res) => {
        setThreadCommentData({
          total: res.data.totalCount,
          records: res.data.data,
        })
      })
      .catch(() => {
        toast('获取评论失败', { type: 'warn' })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (open) {
      getThreadComment()
    }

    return () => {
      setThreadCommentData({
        total: 0,
        records: [],
      })
      setText('')
    }
  }, [open])

  return (
    <Modal
      title="回复详情"
      open={open}
      onClose={onClose}
      options={
        <>
          <TextField.Root
            autoFocus={false}
            style={{ width: '100%' }}
            placeholder={`回复 @${primaryComment?.author?.nickname}`}
            value={text}
            onChange={(e) => {
              setText(e.target.value)
            }}
            maxLength={250}
          />
          <Button
            variant="soft"
            onClick={() => {
              onSendComment(primaryComment.id, '', getThreadComment)
            }}
            disabled={text.length === 0}
            loading={submitLoading}
          >
            <PaperPlaneIcon />
            发送
          </Button>
        </>
      }
    >
      <Spinner loading={loading}>
        <ScrollArea
          type="scroll"
          scrollbars="vertical"
        >
          <div
            className={styles['comment-reply-modal-layout']}
            style={{ maxHeight: `${height * 0.6}px` }}
          >
            <div className={styles['comment-reply-wrapper']}>
              <div className={styles['comment-reply-author']}>
                <div>
                  <Avatar
                    radius="full"
                    src={primaryComment?.author?.avatar?.picture?.picUrl}
                    fallback={primaryComment?.author?.nickname}
                    onClick={() => {
                      setProfileModal({
                        open: true,
                        uid: primaryComment?.author?.uid,
                      })
                    }}
                  />
                </div>
                <div>
                  <p>
                    {primaryComment?.author?.nickname}

                    {primaryComment?.badges?.length > 0
                      ? primaryComment?.badges.map((item) => (
                          <img
                            style={{
                              width: item.icon.width * 0.4,
                              height: item.icon.height * 0.4,
                            }}
                            title={item.tip}
                            src={item.icon.picUrl}
                            alt="badge"
                          />
                        ))
                      : null}
                  </p>
                  <p>
                    {dayjs(primaryComment?.collectedAt).format('YYYY/MM/DD')}{' '}
                    <span>
                      IP属地：
                      {primaryComment?.ipLoc}
                    </span>
                  </p>
                </div>
                <div
                  style={
                    primaryComment?.liked ? { color: 'red' } : { color: 'gray' }
                  }
                >
                  <IoMdThumbsUp />
                  {primaryComment?.likeCount === 0
                    ? null
                    : primaryComment?.likeCount}
                </div>
              </div>
              <div className={styles['player-comment-body']}>
                {primaryComment.voice && (
                  <VoiceComment
                    duration={primaryComment.voice.duration}
                    url={primaryComment.voice.url}
                    waveform={primaryComment.voice.waveform}
                  />
                )}

                {primaryComment?.text}
              </div>
            </div>

            <Text color="gray">评论回复({threadCommentData?.total})</Text>

            {threadCommentData?.records.length === 0 && <Empty />}

            {threadCommentData?.records.map((item) => (
              <div
                key={item.id}
                className={styles['comment-reply-wrapper']}
              >
                <div className={styles['comment-reply-author']}>
                  <div>
                    <Avatar
                      radius="full"
                      src={item?.author.avatar.picture.picUrl}
                      fallback="Avatar"
                      onClick={() => {
                        setProfileModal({
                          open: true,
                          uid: item?.author?.uid,
                        })
                      }}
                    />
                  </div>
                  <div>
                    <p>
                      {item?.author?.nickname}

                      {item.badges.length > 0
                        ? item.badges.map((itm) => (
                            <img
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
                    </p>
                    <p>
                      {dayjs(item?.createdAt).format('YYYY/MM/DD')}{' '}
                      <span>
                        IP属地：
                        {item?.author.ipLoc}
                      </span>
                    </p>
                  </div>

                  <Tooltip content={`回复 @${item.author.nickname}`}>
                    <div
                      style={{ color: 'gray' }}
                      onClick={() => {
                        setCCM({
                          open: true,
                          replyTo: item.author.nickname,
                          replyToCommentId: item.id,
                        })
                      }}
                    >
                      <Pencil2Icon />
                    </div>
                  </Tooltip>

                  {item?.author?.uid === Storage.get('user_info').uid && (
                    <Tooltip content={'删除评论'}>
                      <div
                        style={{ color: '#EB8E90' }}
                        onClick={() => {
                          ShowMessageDialog(
                            DialogType.QUESTION,
                            '提示',
                            '确定删除这条评论吗？',
                          ).then((res) => {
                            if (res === 'Yes' || res === '是') {
                              onRemoveCommentFunc(item.id, getThreadComment)
                            }
                          })
                        }}
                      >
                        <IoMdTrash />
                      </div>
                    </Tooltip>
                  )}

                  <div
                    style={item?.liked ? { color: 'red' } : { color: 'gray' }}
                    onClick={() => {
                      onCommentLikeUpdate(
                        { id: item.id, liked: !item.liked, type: 'COMMENT' },
                        () => {
                          const temp: CommentPrimaryType[] =
                            threadCommentData.records.map((itm) => {
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

                          setThreadCommentData({
                            ...threadCommentData,
                            records: temp,
                          })
                        },
                      )
                    }}
                  >
                    <IoMdThumbsUp />
                    {item?.likeCount === 0 ? null : item?.likeCount}
                  </div>
                </div>
                <div className={styles['player-comment-body']}>
                  {primaryComment.id !== item?.replyToComment?.id && (
                    <span>
                      回复{' '}
                      <span style={{ color: 'rgb(209, 157, 255)' }}>
                        @{item?.replyToComment?.author?.nickname}
                      </span>
                      ：
                    </span>
                  )}
                  {item?.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Spinner>

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
        loading={replyLoading}
        replyTo={CCM.replyTo}
        open={CCM.open}
        onOk={(text) => {
          onSendComment(CCM.replyToCommentId, text, () => {
            setCCM({
              open: false,
              replyTo: '',
              replyToCommentId: '',
            })
            getThreadComment()
          })
        }}
        onClose={() => {
          setCCM({
            open: false,
            replyTo: '',
            replyToCommentId: '',
          })
        }}
      />
    </Modal>
  )
}
