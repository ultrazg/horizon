import React, { useEffect, useState } from 'react'
import { PlayerDrawer } from '@/components'
import { EpisodeCover } from './components/episodeCover'
import { VolumeController } from './components/volumeController'
import { PlayerButtons } from './components/playerButtons'
import { Slider } from '@radix-ui/themes'
import './index.modules.scss'
import { usePlayer } from '@/hooks'
import { PlayInfoType } from '@/utils/player'
import { episodePlayProgressUpdate } from '@/api/episode'
import { updatePlayedList, updatePlayedListType } from '@/api/played'
import { mileageUpdate, type mileageUpdateType } from '@/api/mileage'
import { ReadConfig } from 'wailsjs/go/bridge/App'
import dayjs from 'dayjs'

export const PlayController: React.FC = () => {
  const player = usePlayer()
  const [open, setOpen] = React.useState<boolean>(false)
  const [progress, setProgress] = React.useState<number>(0)
  const [playerLoading, setPlayerLoading] = useState<boolean>(player.isLoading)
  const [playInfo, setPlayInfo] = useState<PlayInfoType>({
    title: '',
    pid: '',
    eid: '',
    cover: '',
    current: 0,
    duration: 0,
    liked: false,
  })

  /**
   * 更新收听概览
   */
  const onMileageUpdate = (startTime: number, endTime: number) => {
    const params: mileageUpdateType = {
      tracking: [
        {
          eid: playInfo.eid,
          pid: playInfo.pid,
          startPlayingTimestamp: startTime,
          endPlayingTimestamp: endTime,
          isSpeaker: false,
          isOffline: false,
          isTrial: false,
          withSpeed: player.playbackRate,
        },
      ],
    }

    mileageUpdate(params)
      .then()
      .catch((err) => {
        console.error(err)
      })
  }

  /**
   * 更新播放历史
   */
  const onUpdatePlayedList = () => {
    const params: updatePlayedListType = {
      eid: playInfo.eid,
    }

    updatePlayedList(params).catch((err) => {
      console.error(err)
    })
  }

  /**
   * 更新单集播放进度
   */
  const onUpdateProgress = () => {
    const params = {
      data: [
        {
          eid: player.playInfo.eid,
          pid: player.playInfo.pid,
          progress: Math.round(player.playInfo.current),
          playedAt: new Date().toISOString(),
        },
      ],
    }

    episodePlayProgressUpdate(params).catch((err) => {
      console.error(err)
    })
  }

  // TODO: 继续上次播放的进度
  // useEffect(() => {
  //   ReadConfig()
  //     .then((res) => {
  //       if (res.play.last_play_eid && res.play.last_play_eid !== '') {
  //         const eid = res.play.last_play_eid
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err)
  //     })
  // }, [])

  useEffect(() => {
    const checkLoading = setInterval(() => {
      setPlayerLoading(player.isLoading)
      setPlayInfo(player.playInfo)
      setProgress(Math.round(player.playInfo.current))
    }, 500)

    const timer = setInterval(() => {
      if (player.isPlaying) {
        onUpdateProgress()
      }
    }, 1000 * 60)

    return () => {
      clearInterval(checkLoading)
      clearInterval(timer)
    }
  }, [player])

  useEffect(() => {
    if (player.isPlaying) {
      onUpdatePlayedList()
    }
  }, [player.episodeInfo.eid])

  useEffect(() => {
    if (player.isPlaying) {
      const timer = setInterval(() => {
        const endTime = dayjs().valueOf()
        const startTime = dayjs().subtract(60, 'seconds').valueOf()

        onMileageUpdate(startTime, endTime)
      }, 60 * 1000)

      return () => {
        clearInterval(timer)
      }
    }
  }, [player.isPlaying])

  return (
    <>
      <div className="play-controller-layout">
        <div className="progress-layout">
          <Slider
            className="progress-slider"
            size="1"
            step={1}
            min={0}
            max={Math.round(playInfo.duration)}
            radius="full"
            value={[progress]}
            onValueChange={(value) => {
              setProgress(value[0])
              player.seek(value[0])
            }}
            defaultValue={[0]}
          />
        </div>

        <div className="left">
          <EpisodeCover
            player={player}
            playInfo={playInfo}
            playerLoading={playerLoading}
            onOpen={() => {
              setOpen(true)
            }}
          />
        </div>

        <div className="middle">
          <PlayerButtons
            player={player}
            playInfo={playInfo}
          />
        </div>

        <div className="right">
          <VolumeController player={player} />
        </div>
      </div>

      <PlayerDrawer
        player={player}
        playInfo={playInfo}
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      />
    </>
  )
}
