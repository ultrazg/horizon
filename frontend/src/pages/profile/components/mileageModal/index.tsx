import React, { useEffect, useState } from 'react'
import { Modal } from '@/components'
import { modalType } from '@/types/modal'
import { ScrollArea, Tabs, Spinner } from '@radix-ui/themes'
import { useWindowSize } from '@/hooks'
import { mileageList } from '@/api/mileage'
import { mileageType } from '@/types/mileage'
import styles from './index.module.scss'
import { PodcastType } from '@/types/podcast'
import { MileageProgressView } from './mileageProgressView'

type IProps = {
  data: mileageType & { time: number[] }
} & modalType

/**
 * 收听数据弹窗
 */
export const MileageModal: React.FC<IProps> = ({ data, open, onClose }) => {
  const [height] = useState(useWindowSize().height * 0.4)
  const { width } = useWindowSize()
  const [playedData, setPlayedData] = useState<
    mileageType & { time: number[] }
  >({
    totalPlayedSeconds: 0,
    lastSevenDayPlayedSeconds: 0,
    lastThirtyDayPlayedSeconds: 0,
    tagline: '',
    time: [0, 0, 0],
  })
  const [type, setType] = useState<string>('0')
  const [mileage30Info, setMileage30Info] =
    useState<{ playedSeconds: number; podcast: PodcastType }[]>()
  const [mileageAllInfo, setMileageAllInfo] =
    useState<{ playedSeconds: number; podcast: PodcastType }[]>()
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * 获取最近三十天收听数据
   */
  const fetchMileage30Data = async () => {
    await mileageList({ all: false })
      .then((res) => setMileage30Info(res.data.data))
      .catch((err) => {
        console.error(err)
      })
  }

  /**
   * 获取全部收听数据
   */
  const fetchMileageAllData = async () => {
    await mileageList({ all: true })
      .then((res) => setMileageAllInfo(res.data.data))
      .catch((err) => {
        console.error(err)
      })
  }

  /**
   * 获取收听数据列表
   */
  const fetchData = () => {
    setLoading(true)
    Promise.allSettled([fetchMileage30Data(), fetchMileageAllData()]).finally(
      () => setLoading(false),
    )
  }

  const onTabChange = (type: string) => {
    setType(type)
  }

  useEffect(() => {
    if (open) {
      setPlayedData(data)
      fetchData()
    }

    return () => {
      setType('0')
      setMileage30Info([])
      setMileageAllInfo([])
    }
  }, [open])

  return (
    <Modal
      title="收听数据"
      open={open}
      onClose={onClose}
      width={`${width * 0.6}px`}
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

      <Tabs.Root
        defaultValue="0"
        onValueChange={onTabChange}
      >
        <Tabs.List>
          <Tabs.Trigger value="0">最近三十天</Tabs.Trigger>
          <Tabs.Trigger value="1">全部</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      <div className={styles['played-time-wrapper']}>
        <ScrollArea
          type="hover"
          scrollbars="vertical"
          style={{ maxHeight: height }}
        >
          <Spinner loading={loading}>
            <MileageProgressView
              mileageData={type === '0' ? mileage30Info : mileageAllInfo}
            />
          </Spinner>
        </ScrollArea>
      </div>
    </Modal>
  )
}
