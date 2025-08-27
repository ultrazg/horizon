import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import { PodcastType } from '@/types/podcast'
import { Avatar } from '@radix-ui/themes'
import { formatTime } from '@/pages/profile/components/mileageDuration'
import { Empty } from '@/components'

type IProps = {
  mileageData: { playedSeconds: number; podcast: PodcastType }[] | undefined
}

/**
 * 收听数据-全部
 * @param mileageData
 * @constructor
 */
export const MileageAllView: React.FC<IProps> = ({ mileageData }) => {
  const progressWrapperRef = useRef<HTMLDivElement>(null)
  const [columnLength, setColumnLength] = useState<number[]>()

  useEffect(() => {
    if (mileageData && mileageData.length != 0) {
      const maxValue: number = mileageData[0].playedSeconds
      const wrapperWidth: number = progressWrapperRef?.current?.offsetWidth || 1
      const columnLength: number[] = []

      mileageData.forEach((item) => {
        columnLength.push((item.playedSeconds / maxValue) * wrapperWidth * 0.7)
      })

      setColumnLength(columnLength)
    }
  }, [mileageData])

  return (
    <div className={styles['mileage-all-view-wrapper']}>
      {(!mileageData || mileageData.length === 0) && <Empty />}

      {mileageData?.map((item, index: number) => (
        <div
          ref={progressWrapperRef}
          className={styles['progress-wrapper']}
          key={item.podcast.pid}
          title={item.podcast.title}
        >
          <div
            style={{ width: `${columnLength?.[index]}px` }}
            className={styles['progress-bar']}
          />
          <div className={styles['podcast-info']}>
            <div>
              <Avatar
                style={{ width: '3rem', height: '3rem' }}
                src={item.podcast.image.picUrl}
                fallback={item.podcast.title}
              />
            </div>
            <div className={styles['info-wrapper']}>
              <p className={styles['podcast-title']}>{item.podcast.title}</p>
              <p className={styles['played-time']}>
                {formatTime(item.playedSeconds)[0] === 0
                  ? ''
                  : formatTime(item.playedSeconds)[0] + '时'}
                {formatTime(item.playedSeconds)[1] === 0
                  ? ''
                  : formatTime(item.playedSeconds)[1] + '分'}
                {formatTime(item.playedSeconds)[2]}秒
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
