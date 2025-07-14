import React, { useEffect, useState } from 'react'
import { Card } from '@radix-ui/themes'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { StickerModal } from '@/components'
import { sticker } from '@/api/sticker'
import { userType } from '@/types/user'
import { Storage } from '@/utils'
import { stickerType } from '@/types/sticker'
import styles from './index.module.scss'

export const Sticker = () => {
  const [stickerModalOpen, setStickerModalOpen] = useState<boolean>(false)
  const [data, setData] = useState<{
    records: stickerType[]
    total: number
  }>({
    records: [],
    total: 0,
  })

  /**
   * 获取贴纸数据
   */
  const getData = () => {
    const info: userType = Storage.get('user_info')
    const params = {
      uid: info.uid,
    }

    sticker(params)
      .then((res) =>
        setData({
          records: res.data.data,
          total: res.data.total,
        }),
      )
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className={styles['sticker-content']}>
      <h3>我的贴纸库</h3>

      <Card
        className={styles['sticker-card']}
        onClick={() => {
          setStickerModalOpen(true)
        }}
      >
        <div
          className={styles['sticker-bgi']}
          style={{
            backgroundImage: `url(${data.records.length === 0 ? '' : data.records[0].image.picUrl})`,
          }}
        />
        <div>
          {data.total}张贴纸
          <ChevronRightIcon />
        </div>
        <div>
          最新：{data.records.length === 0 ? '-' : data.records[0].name}
        </div>
      </Card>

      <StickerModal
        perspective="我"
        stickerLists={data.records}
        open={stickerModalOpen}
        onClose={() => {
          setStickerModalOpen(false)
        }}
      />
    </div>
  )
}
