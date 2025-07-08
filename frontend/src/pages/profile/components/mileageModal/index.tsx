import React, { useEffect, useState } from 'react'
import { Modal } from '@/components'
import { modalType } from '@/types/modal'
import {
  Button,
  Dialog,
  Flex,
  Separator,
  Box,
  Avatar,
  Text,
  Heading,
  ScrollArea,
} from '@radix-ui/themes'
import { useWindowSize } from '@/hooks'
import { mileageList } from '@/api/mileage'
import { formatTime } from '../mileageDuration'
import { mileageType } from '@/types/mileage'
import styles from './index.module.scss'

type IProps = {
  data: mileageType & { time: number[] }
} & modalType

/**
 * 收听数据弹窗
 */
export const MileageModal: React.FC<IProps> = ({ data, open, onClose }) => {
  const [height] = useState(useWindowSize().height * 0.4)
  const [playedData, setPlayedData] = useState<
    mileageType & { time: number[] }
  >({
    totalPlayedSeconds: 0,
    lastSevenDayPlayedSeconds: 0,
    lastThirtyDayPlayedSeconds: 0,
    tagline: '',
    time: [0, 0, 0],
  })
  const [lists, setLists] = useState<any>([])

  /**
   * 获取收听数据列表
   */
  const getList = () => {
    mileageList({})
      .then((res) => setLists(res.data.data))
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    if (open) {
      setPlayedData(data)
      getList()
    }
  }, [open])

  return (
    <Modal
      title="收听数据"
      open={open}
      onClose={onClose}
    >
      <div className={styles['tagline-layout']}>
        <div>
          <span className={styles['num']}>{playedData.time[0]}</span>
          小时
          <span className={styles['num']}>{playedData.time[1]}</span>
          分钟
        </div>
        <div>{playedData.tagline}</div>
      </div>

      <Separator
        my="3"
        size="4"
      />

      <div>
        <ScrollArea
          type="auto"
          scrollbars="vertical"
          style={{ maxHeight: height }}
        >
          {lists.map((item: any) => (
            <Box
              key={item.podcast.pid}
              width="100%"
              height="3rem"
              mb="4"
            >
              <Flex gap="2">
                <Avatar
                  style={{ width: '3rem', height: '3rem' }}
                  src={item.podcast.image.picUrl}
                  fallback={item.podcast.title}
                />
                <Box>
                  <Heading
                    mb="1"
                    size="3"
                  >
                    {item.podcast.title}
                  </Heading>
                  <Text className={styles['played-time']}>
                    {formatTime(item.playedSeconds)[0] === 0
                      ? ''
                      : formatTime(item.playedSeconds)[0] + '时'}
                    {formatTime(item.playedSeconds)[1] === 0
                      ? ''
                      : formatTime(item.playedSeconds)[1] + '分'}
                    {formatTime(item.playedSeconds)[2]}秒
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </ScrollArea>
      </div>
    </Modal>
  )
}
