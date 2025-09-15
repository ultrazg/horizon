import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { toast } from '@/utils'
import { usePlayer } from '@/layouts/player'

type IProps = {
  duration: number
  url: string
  waveform: number[]
}

/**
 * 语音评论
 * @param duration
 * @param url
 * @param waveform
 * @constructor
 */
const VoiceComment: React.FC<IProps> = ({ duration, url, waveform }) => {
  const player = usePlayer()
  const [time, setTime] = useState<number>(0)
  const [isCounting, setIsCounting] = useState<boolean>(false)
  const [isPlaying] = useState(player.isPlaying)

  const onTimeLeft = () => {
    if (!isCounting) {
      setTime(duration)
      setIsCounting(true)
    }
  }

  const onPlay = () => {
    if (isCounting) return

    const audio = new Audio(url)

    if (isPlaying) {
      player.pause()
    }

    audio
      .play()
      .then(() => {
        onTimeLeft()
      })
      .catch((err) => {
        console.error('播放语音失败', err)

        toast('播放语音失败', {
          type: 'warn',
        })
      })
  }

  useEffect(() => {
    let interval: any
    if (isCounting && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1)
      }, 1000)
    } else if (time === 0) {
      setIsCounting(false)

      if (isPlaying) {
        player.play()
      }
    }
    return () => clearInterval(interval)
  }, [isCounting, time])

  return (
    <div className={styles['voice-comment-wrapper']}>
      <div
        className={styles['duration']}
        onClick={onPlay}
      >
        <span>{isCounting ? `${time}` : `${duration}`}</span>s
      </div>
      <div
        className={styles['wave-form-wrapper']}
        onClick={onPlay}
      >
        <div className={styles['wave-form']}>
          {waveform.map((item, index) => (
            <div
              className={
                isCounting
                  ? styles['wave-chunks-animate']
                  : styles['wave-chunks']
              }
              key={index}
              style={{ height: `${item * 0.5 + 10}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default VoiceComment
