import React, { useEffect, useState } from 'react'
import { modalType } from '@/types/modal'
import styles from './index.module.scss'
import { Modal } from '@/components'
import { APP_VERSION, ShowChangelog, toast } from '@/utils'
import { Button, Spinner } from '@radix-ui/themes'
import { UpdateIcon } from '@radix-ui/react-icons'
import { MarkdownContent } from '@/components/markdownContent'

type IProps = {
  newVersionInfo: {
    createdAt: string
    tagName: string
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
  const [changelog, setChangelog] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (open && !changelog) {
      setLoading(true)
      ShowChangelog()
        .then((res) => {
          if (res.flag) {
            setChangelog(res.info)
          } else {
            toast(res.err, { type: 'warn', duration: 5000 })
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [open, changelog])

  return (
    <Modal
      title="发现新版本"
      width={'400px'}
      open={open}
      onClose={onClose}
      options={
        <Button
          onClick={() => {
            onOk?.()
          }}
        >
          <UpdateIcon />
          立即更新
        </Button>
      }
    >
      <div className={styles['wrapper']}>
        <p className={styles['label']}>
          发布时间：<pre>{newVersionInfo.createdAt}</pre>
        </p>
        <p className={styles['label']}>
          当前版本：<pre>v{APP_VERSION}</pre>
        </p>
        <p className={styles['label']}>
          最新版本：<pre>{newVersionInfo.tagName}</pre>
        </p>
        <div className={styles['update-content']}>
          <p className={styles['label']}>版本历史：</p>
          <Spinner loading={loading}>
            <div className={styles['markdown-wrapper']}>
              <MarkdownContent content={changelog} />
            </div>
          </Spinner>
        </div>
      </div>
    </Modal>
  )
}
