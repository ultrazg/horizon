import React, { useEffect } from 'react'
import {
  episodeLiveCount,
  liveStatsReport,
  liveStatsReportType,
} from '@/api/episode'
import './index.modules.scss'

type IProps = {
  open: boolean
  eid: string
  pid: string
}

export const LiveCount: React.FC<IProps> = ({ open, eid, pid }) => {
  const [liveCount, setLiveCount] = React.useState<string | number>(0)

  /**
   * 上报播放统计数据
   */
  const reportLiveStats = () => {
    const params: liveStatsReportType = {
      eid,
      pid,
    }

    liveStatsReport(params).then()
  }

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
      reportLiveStats()
      getLiveCount()

      timer = setInterval(() => {
        reportLiveStats()
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
