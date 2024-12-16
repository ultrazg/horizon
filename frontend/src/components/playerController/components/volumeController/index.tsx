import React, { useState } from 'react'
import { SpeakerLoudIcon, SpeakerOffIcon } from '@radix-ui/react-icons'
import { Button, Slider } from '@radix-ui/themes'
import './index.modules.scss'

export const VolumeController = () => {
  const [volume, setVolume] = useState<number>(75)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [previousVolume, setPreviousVolume] = useState<number>(75)

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

  return (
    <>
      <div className="volume-layout">
        <div className="volume-value">
          <Button
            variant="ghost"
            onClick={() => {
              toggleMuted()
            }}
          >
            {isMuted ? <SpeakerOffIcon /> : <SpeakerLoudIcon />}
          </Button>
        </div>
        <div className="volume-slider">
          <Slider
            step={5}
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
