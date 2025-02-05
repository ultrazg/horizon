import React, { useEffect } from 'react'
import { Modal } from '@/components'
import { modalType } from '@/types/modal'
import './index.modules.scss'
import { Avatar, Button, Text, TextField, ScrollArea } from '@radix-ui/themes'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { useDisplayInfo } from '@/hooks'
import { IoMdThumbsUp } from 'react-icons/io'
import { commentThread, commentThreadType } from '@/api/comment'
import { CommentPrimaryType } from '@/types/comment'
import dayjs from 'dayjs'

type IProps = {
  primaryComment: CommentPrimaryType
} & modalType

/**
 * 评论回复弹窗
 * @param primaryComment
 * @param open 是否打开
 * @param onClose 关闭弹窗
 * @constructor
 */
export const CommentReplyModal: React.FC<IProps> = ({
  primaryComment,
  open,
  onClose,
}) => {
  const [height] = React.useState<number>(useDisplayInfo().Height)

  const getThreadComment = () => {
    const params: commentThreadType = {
      primaryCommentId: primaryComment.id,
      order: 'SMART',
    }

    commentThread(params).then((res) => {
      console.log(res.data)
      // TODO
    })
  }

  useEffect(() => {
    if (open) {
      getThreadComment()
    }
  }, [open])

  return (
    <Modal
      title="回复"
      open={open}
      onClose={onClose}
      options={
        <>
          <TextField.Root
            style={{ width: '100%' }}
            placeholder={`回复 ${primaryComment?.author?.nickname}`}
          />
          <Button variant="soft">
            <PaperPlaneIcon />
            评论
          </Button>
        </>
      }
    >
      <ScrollArea
        type="hover"
        scrollbars="vertical"
      >
        <div
          className="comment-reply-modal-layout"
          style={{ height: `${height * 0.6}px` }}
        >
          <div className="comment-reply-wrapper">
            <div className="comment-reply-author">
              <div>
                <Avatar
                  radius="full"
                  src={primaryComment?.author?.avatar?.picture?.picUrl}
                  fallback="A"
                />
              </div>
              <div>
                <p>{primaryComment?.author?.nickname}</p>
                <p>
                  {dayjs(primaryComment.collectedAt).format('YYYY/MM/DD')}{' '}
                  <span>{primaryComment.ipLoc}</span>
                </p>
              </div>
              <div>
                <IoMdThumbsUp color={primaryComment.liked ? 'white' : 'gray'} />
                {primaryComment.likeCount}
              </div>
            </div>
            <div className="player-comment-body">{primaryComment.text}</div>
          </div>

          <Text color="gray">评论回复{}</Text>

          <div className="comment-reply-wrapper">
            <div className="comment-reply-author">
              <div>
                <Avatar
                  radius="full"
                  src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                  fallback="A"
                />
              </div>
              <div>
                <p>不开玩笑小助手</p>
                <p>
                  10/23 <span>上海</span>
                </p>
              </div>
              <div>
                <IoMdThumbsUp />
                23
              </div>
            </div>
            <div className="player-comment-body">
              窦娥在刑场即将行刑时 看着漫天的大雪 哭诉道：“冤深，启冻！”
              后人都称：万冤深导致的 后人悲呼：万冤身亡的 商鞅：原来你也万冤身
              有人觉得窦娥不怨 对此我想说：冤身怎么你了？
            </div>
          </div>
        </div>
      </ScrollArea>
    </Modal>
  )
}
