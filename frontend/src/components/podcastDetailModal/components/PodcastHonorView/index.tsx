import React, { useEffect, useState } from 'react'
import { podcastHonorList } from '@/api/podcast'
import styles from './index.module.scss'
import { PodcastHonorType } from '@/types/podcast'
import { Card } from '@radix-ui/themes'

type IProps = {
  pid: string | undefined
  color: string | undefined
}

const PodcastHonorView: React.FC<IProps> = ({ pid, color }) => {
  const [data, setData] = useState<PodcastHonorType[]>([])

  function fetchData(): void {
    podcastHonorList({ pid: pid || '' }).then((res) => {
      setData(res.data.data)
    })
  }

  useEffect(() => {
    if (pid) {
      fetchData()
    }

    return () => {
      setData([])
    }
  }, [pid])

  return data.length > 0 ? (
    <div className={styles['podcast-honor-view']}>
      <div
        className={styles['part-title']}
        style={{
          color,
        }}
      >
        节目荣誉墙
      </div>

      <div className={styles['podcast-honor-list']}>
        {data.map((item) => (
          <Card
            key={item.id}
            className={styles['podcast-honor-item']}
          >
            <p>{item.title}</p>
            <p>{item.campaignTitle}</p>
          </Card>
        ))}
      </div>
    </div>
  ) : null
}

export default PodcastHonorView
