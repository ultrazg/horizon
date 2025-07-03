import React, { useEffect, useState } from 'react'
import { SpeakerLoudIcon, SpeakerOffIcon } from '@radix-ui/react-icons'
import { Button, Slider } from '@radix-ui/themes'
import styles from './index.module.scss'
import { Player } from '@/utils'

type IProps = {
  player: Player
}

export const VolumeController: React.FC<IProps> = ({ player }) => {
  const [volume, setVolume] = useState<number>(0.8)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [previousVolume, setPreviousVolume] = useState<number>(0.8)

  const onVolumeChange = (v: number[]) => {
    setVolume(v[0])

    if (v[0] > 0) {
      setIsMuted(false)
    } else {
      setIsMuted(true)
    }
  }

  const toggleMuted = () => {
    if (isMuted) {
      setVolume(previousVolume)
      setIsMuted(false)
    } else {
      setPreviousVolume(volume)
      setVolume(0)
      setIsMuted(true)
    }
  }

  useEffect(() => {
    player.setVolume(volume)
  }, [volume])

  return (
    <>
      <div className={styles['volume-layout']}>
        <div className={styles['volume-value']}>
          <Button
            variant="ghost"
            onClick={() => {
              toggleMuted()
            }}
          >
            {isMuted ? <SpeakerOffIcon /> : <SpeakerLoudIcon />}
          </Button>
        </div>
        <div className={styles['volume-slider']}>
          <Slider
            max={1}
            step={0.05}
            value={[isMuted ? 0 : volume]}
            variant="soft"
            onValueChange={(v: number[]) => {
              onVolumeChange(v)
            }}
          />
        </div>
      </div>
    </>
  )
}
