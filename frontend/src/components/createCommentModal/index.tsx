import React, { useEffect, useState } from 'react'
import { TextArea, Button } from '@radix-ui/themes'
import { modalType } from '@/types/modal'
import { Modal } from '@/components'
import { Storage } from '@/utils'
import { PaperPlaneIcon, TrashIcon } from '@radix-ui/react-icons'
import styles from './index.module.scss'
import { createComment, type createCommentType } from '@/api/comment'
import { userType } from '@/types/user'

type IProps = {
  id: string
  replyTo: string
  replyToCommentId?: string
} & modalType

/**
 * 回复评论弹窗
 * @param id
 * @param replyTo
 * @param replyToCommentId
 * @param open
 * @param onOk
 * @param onClose
 * @constructor
 */
export const CreateCommentModal: React.FC<IProps> = ({
  id,
  replyTo = 'Unknown',
  replyToCommentId,
  open,
  onOk,
  onClose,
}) => {
  const [text, setText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * 发送评论
   */
  const onSendComment = () => {
    const params: createCommentType = {
      text,
      id,
      type: 'EPISODE',
    }

    if (replyToCommentId) {
      params.replyToCommentId = replyToCommentId
    }

    const userInfo: userType = Storage.get('user_info')

    return console.log(userInfo)

    setLoading(true)

    createComment(params)
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    setText('')
  }, [])

  return (
    <Modal
      title={
        <>
          回复 <span style={{ color: 'rgb(209, 157, 255)' }}>@{replyTo}</span>
        </>
      }
      open={open}
      onClose={onClose}
      options={
        <>
          <Button
            variant="soft"
            disabled={text.length === 0}
            onClick={onSendComment}
            loading={loading}
          >
            <PaperPlaneIcon />
            发送
          </Button>
          <Button
            variant="soft"
            color="gray"
            onClick={() => {
              setText('')
            }}
            disabled={text.length === 0}
          >
            <TrashIcon />
            清空
          </Button>
        </>
      }
    >
      <TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={250}
      />
      <p className={styles['char-count']}>{text.length}/250</p>
    </Modal>
  )
}
