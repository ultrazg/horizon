import React, { useEffect, useState } from 'react'
import { Player } from '@/components'
import { EpisodeCover } from './components/episodeCover'
import { VolumeController } from './components/volumeController'
import { PlayerButtons } from './components/playerButtons'
import { Slider } from '@radix-ui/themes'
import './index.modules.scss'
import UserStore from '@/store/user'

export const PlayController = () => {
  const [open, setOpen] = React.useState<boolean>(false)
  const [progress, setProgress] = React.useState<number>(0)

  useEffect(() => {
    UserStore.initSetMusic()
  }, [])

  const handleMusic = (type: string, time: number = 0) => {
    console.log('handleMusic', type)
    switch (type) {
      case 'play':
        UserStore.musicInfo.play()
        break
      case 'pause':
        UserStore.musicInfo.pause()
        break
      case 'next':
        UserStore.musicInfo.playNext()
        break
      case 'prev':
        UserStore.musicInfo.playPre()
        break
      case 'progres':
        UserStore.musicInfo.seek(time)
      default:
        break
    }
  }

  return (
    <>
      <div className="play-controller-layout">
        <div className="progress-layout">
          <Slider
            className="progress-slider"
            size="1"
            step={1}
            min={0}
            max={100}
            radius="none"
            value={[progress]}
            onValueChange={(value) => {
              setProgress(value[0])
              // UserStore.musicInfo.curProgress = value[0]
            }}
            onValueCommit={(value) => {
              console.log("结算=", value)
              handleMusic('progres',value[0])
            }}
            defaultValue={[0]}
          />
        </div>
        
        <div className="left">
          <EpisodeCover
            onOpen={() => {
              setOpen(true)
            }}
          />
        </div>

        <div className="middle">
          <PlayerButtons onHandleMusic={(e: string) => handleMusic(e)} />
        </div>

        <div className="right">
          <VolumeController />
        </div>
      </div>

      <Player
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      />
    </>
  )
}
