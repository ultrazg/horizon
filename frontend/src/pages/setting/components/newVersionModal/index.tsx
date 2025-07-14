import React from 'react'
import { modalType } from '@/types/modal'
import styles from './index.module.scss'
import { Modal } from '@/components'
import { APP_VERSION } from '@/utils'
import { Button } from '@radix-ui/themes'
import { UpdateIcon } from '@radix-ui/react-icons'

type IProps = {
  newVersionInfo: {
    createdAt: string
    tagName: string
    body: string
  }
}

/**
 * 新版本内容弹窗
 * @param open
 * @param onOk
 * @param onClose
 * @param newVersionInfo
 * @constructor
 */
export const NewVersionModal: React.FC<modalType & IProps> = ({
  open,
  onOk,
  onClose,
  newVersionInfo,
}) => {
  return (
    <Modal
      title="发现新版本"
      width={'400px'}
      open={open}
      onClose={onClose}
      options={
        <>
          <Button
            onClick={() => {
              onOk?.()
            }}
          >
            <UpdateIcon />
            立即更新
          </Button>
        </>
      }
    >
      <div className={styles['wrapper']}>
        <p className={styles['label']}>
          发布时间：<span>{newVersionInfo.createdAt}</span>
        </p>
        <p className={styles['label']}>
          当前版本：<span>v{APP_VERSION}</span>
        </p>
        <p className={styles['label']}>
          最新版本：<span>{newVersionInfo.tagName}</span>
        </p>
        <p className={styles['label']}>
          更新内容：
          <pre>{newVersionInfo.body}</pre>
        </p>
      </div>
    </Modal>
  )
}
