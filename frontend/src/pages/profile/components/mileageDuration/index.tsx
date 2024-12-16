import React, { useEffect, useState } from 'react'
import { Card } from '@radix-ui/themes'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { MileageModal } from '@/pages/profile/components/mileageModal'
import { mileageGet } from '@/api/mileage'
import { mileageType } from '@/types/mileage'
import './index.modules.scss'

export const formatTime = (totalSeconds: number): number[] => {
  const hours: number = Math.floor(totalSeconds / 3600)
  const minutes: number = Math.floor((totalSeconds % 3600) / 60)
  const seconds: number = Math.floor(totalSeconds % 60)

  return [hours, minutes, seconds]
}

export const MileageDuration: React.FC = () => {
  const [mileageModalOpen, setMileageModalOpen] = useState<boolean>(false)
  const [time, setTime] = useState<number[]>([0, 0, 0])
  const [data, setData] = useState<mileageType & { time: number[] }>({
    totalPlayedSeconds: 0,
    lastSevenDayPlayedSeconds: 0,
    lastThirtyDayPlayedSeconds: 0,
    tagline: '',
    time: [0, 0, 0],
  })

  useEffect(() => {
    mileageGet().then((res) => {
      const total: number = res.data.data.totalPlayedSeconds

      setTime(formatTime(total))
      setData({
        ...res.data.data,
        time: formatTime(total),
      })
    })
  }, [])

  return (
    <div className="time-content">
      <h3>收听时长</h3>

      <Card
        className="time-card"
        onClick={() => {
          setMileageModalOpen(true)
        }}
      >
        <div>
          <span className="num">{time[0]}</span>时
          <span className="num">{time[1]}</span>分
        </div>
        <div>
          总收听时长
          <ChevronRightIcon />
        </div>
      </Card>

      <MileageModal
        data={data}
        open={mileageModalOpen}
        onClose={() => {
          setMileageModalOpen(false)
        }}
      />
    </div>
  )
}
