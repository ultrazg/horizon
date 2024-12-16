import React from 'react'
import { Modal } from '@/components'
import { modalType } from '@/types/modal'
import './index.modules.scss'
import {
  Avatar,
  Button,
  Dialog,
  Text,
  TextField,
  ScrollArea,
} from '@radix-ui/themes'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { useDisplayInfo } from '@/hooks'
import { IoMdThumbsUp } from 'react-icons/io'

type IProps = {
  id: string
} & modalType

/**
 * 评论回复弹窗
 * @param id 评论id
 * @param open 是否打开
 * @param onClose 关闭弹窗
 * @constructor
 */
export const CommentReplyModal: React.FC<IProps> = ({ id, open, onClose }) => {
  const [height] = React.useState<number>(useDisplayInfo().Height)

  return (
    <Modal
      title="回复"
      open={open}
      onClose={onClose}
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

          <Text color="gray">评论回复</Text>

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

      <div className="comment-reply-bottom">
        <div>
          <TextField.Root placeholder="回复给..." />
        </div>
        <div>
          <Button variant="soft">
            <PaperPlaneIcon />
            评论
          </Button>
        </div>
        <div>
          <Dialog.Close>
            <Button
              variant="soft"
              color="gray"
            >
              关闭
            </Button>
          </Dialog.Close>
        </div>
      </div>
    </Modal>
  )
}
