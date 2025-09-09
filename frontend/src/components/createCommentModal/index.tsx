import React, { useEffect, useState } from 'react'
import { TextArea, Button } from '@radix-ui/themes'
import { modalType } from '@/types/modal'
import { Modal } from '@/components'
import { PaperPlaneIcon, TrashIcon } from '@radix-ui/react-icons'
import styles from './index.module.scss'

type IProps = {
  replyTo?: string
  loading: boolean
} & modalType

/**s
 * 创建评论弹窗
 * @param id
 * @param replyTo
 * @param loading
 * @param open
 * @param onOk
 * @param onClose
 * @constructor
 */
export const CreateCommentModal: React.FC<IProps> = ({
  replyTo,
  loading,
  open,
  onOk,
  onClose,
}) => {
  const [text, setText] = useState<string>('')

  useEffect(() => {
    setText('')
  }, [open])

  return (
    <Modal
      title={
        <>
          {replyTo ? (
            <div>
              回复{' '}
              <span style={{ color: 'rgb(209, 157, 255)' }}>@{replyTo}</span>
            </div>
          ) : (
            '评论'
          )}
        </>
      }
      open={open}
      onClose={onClose}
      options={
        <>
          <Button
            variant="soft"
            disabled={text.length === 0}
            onClick={() => {
              onOk?.(text)
            }}
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
