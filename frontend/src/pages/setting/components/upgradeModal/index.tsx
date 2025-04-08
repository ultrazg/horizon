import React, { useEffect, useState } from 'react'
import { Button, Progress } from '@radix-ui/themes'
import { UpdateIcon, Cross2Icon } from '@radix-ui/react-icons'
import { Modal } from '@/components'
import { modalType } from '@/types/modal'
import { EventsOn } from 'wailsjs/runtime'
import { Download, Upgrade, CancelUpgrade } from 'wailsjs/go/bridge/App'
import { DialogType, ShowMessageDialog } from '@/utils'

export const UpgradeModal: React.FC<modalType> = ({ open, onClose }) => {
  const [downloadComplete, setDownloadComplete] = useState<boolean>(false)
  const [downloadInfo, setDownloadInfo] = useState<{
    progress: number
    total: number
    downloaded: number
  }>({
    progress: 0,
    total: 0,
    downloaded: 0,
  })

  const onUpgrade = () => {
    Upgrade().then()
  }

  const onCancelUpgrade = async () => {
    await CancelUpgrade()
    onClose()
  }

  useEffect(() => {
    if (open) {
      Download().catch((err) => {
        ShowMessageDialog(DialogType.ERROR, 'Download error', err).then()
      })

      EventsOn(
        'download-progress',
        (progress: number, total: number, downloaded: number) => {
          setDownloadInfo({
            progress,
            total,
            downloaded,
          })
        },
      )

      EventsOn('download-error', (error: string) => {
        console.error('error', error)
      })

      EventsOn('download-complete', () => {
        setDownloadComplete(true)
      })
    }

    return () => {
      setDownloadComplete(false)
      setDownloadInfo({
        progress: 0,
        total: 0,
        downloaded: 0,
      })
    }
  }, [open])

  return (
    <Modal
      title={downloadComplete ? '下载完成' : '正在下载更新'}
      open={open}
      onClose={onClose}
      options={
        <>
          <Button
            variant="soft"
            color="gray"
            onClick={() => onCancelUpgrade()}
          >
            <Cross2Icon />
            取消更新
          </Button>
          <Button
            variant="soft"
            disabled={!downloadComplete}
            onClick={() => onUpgrade()}
          >
            <UpdateIcon />
            重启应用
          </Button>
        </>
      }
      hiddenCloseBtn
    >
      <div style={{ marginTop: 24, marginBottom: 24 }}>
        <Progress
          value={downloadInfo.progress}
          max={100}
        />
        <div style={{ marginTop: 8 }}>
          {(downloadInfo.downloaded / 1024 / 1024).toFixed(2)}M /{' '}
          {(downloadInfo.total / 1024 / 1024).toFixed(2)}M
        </div>
      </div>
    </Modal>
  )
}
