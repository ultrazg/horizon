import React from 'react'
import styles from './index.module.scss'
import { PodcastType } from '@/types/podcast'
import { Avatar, Box, Flex, Heading, Text } from '@radix-ui/themes/dist/esm'
import { formatTime } from '@/pages/profile/components/mileageDuration'
import { Empty } from '@/components'

type IProps = {
  mileageData: { playedSeconds: number; podcast: PodcastType }[] | undefined
}

/**
 * 收听数据-最近三十天
 * @param mileageData
 * @constructor
 */
export const Mileage30View: React.FC<IProps> = ({ mileageData }) => {
  return (
    <div className={styles['mileage30-view-wrapper']}>
      {(!mileageData || mileageData.length === 0) && <Empty />}

      {mileageData?.map((item) => (
        <Box
          key={item.podcast.pid}
          width="100%"
          height="3rem"
          mb="4"
          title={item.podcast.title}
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
    </div>
  )
}
