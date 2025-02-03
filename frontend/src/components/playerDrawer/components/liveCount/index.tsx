import React, { useEffect } from 'react'
import { episodeLiveCount } from '@/api/episode'
import './index.modules.scss'

type IProps = {
  open: boolean
  eid: string
}

export const LiveCount: React.FC<IProps> = ({ open, eid }) => {
  const [liveCount, setLiveCount] = React.useState<string | number>(0)

  /**
   * 获取正在收听人数
   */
  const getLiveCount = () => {
    const params = {
      eid,
    }

    episodeLiveCount(params).then((res) => {
      setLiveCount(res.data.data.audiencesCountText)
    })
  }

  useEffect(() => {
    let timer: any

    if (open) {
      getLiveCount()

      timer = setInterval(() => {
        getLiveCount()
      }, 1000 * 60)
    }

    return () => clearInterval(timer)
  }, [open])

  return (
    <div className="live-count-layout">
      <div className="live-dot" />
      {liveCount || 'null'} 人正在听
    </div>
  )
}
