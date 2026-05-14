import React, { useEffect, useState } from 'react'
import { Spinner } from '@radix-ui/themes'
import { Modal } from '@/components'
import { modalType } from '@/types/modal'
import { podcastDetail } from '@/api/podcast'
import { PodcastType } from '@/types/podcast'
import { useWindowSize } from '@/hooks'

type IProps = {
  pid: string
} & modalType

export const PodcastDetailModal: React.FC<IProps> = ({
  pid,
  open,
  onClose,
}) => {
  const height = useWindowSize().height
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<PodcastType>()

  function fetchData(): void {
    setLoading(true)

    podcastDetail({
      pid,
    })
      .then((res) => {
        console.log(res)
        setData(res.data.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (open) {
      fetchData()
    }
  }, [open])

  return (
    <Modal
      title="节目详情"
      open={open}
      onClose={onClose}
      backgroundImage={data?.image.picUrl}
    >
      <Spinner loading={loading}>
        <div style={{ maxHeight: height * 0.6, overflowY: 'auto' }}>
          {data?.title}
        </div>
      </Spinner>
    </Modal>
  )
}
