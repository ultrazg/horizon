import React from 'react'
import { Player, toast } from '@/utils'
import styles from './index.module.scss'

type IProps = {
  player: Player
  text: string
}

/**
 * 高亮时间字符串，点击后跳转到对应时间播放
 * @param text
 * @param player
 * @constructor
 */
const HighlightTimeStrings: React.FC<IProps> = ({ text, player }) => {
  const timeRegex = /\b(\d{1,2}:)?\d{1,2}:\d{2}\b/g

  const parts = text.split(timeRegex)

  const matches = text.match(timeRegex) || []

  let matchIndex = 0

  const onSeek = (time: string) => {
    const [minutes, seconds] = time.split(':').map(Number)
    const totalSeconds = minutes * 60 + seconds

    player.seek(totalSeconds)
    if (!player.isPlaying) {
      player.play()
    }

    toast(`已跳转到 ${time}`, { type: 'info' })
  }

  return (
    <>
      <span>
        {parts.map((part, index) => {
          if (
            (index % 2 === 1 || (index % 2 === 0 && part.match(timeRegex))) &&
            matchIndex < matches.length
          ) {
            const match = matches[matchIndex++]
            return (
              <span
                key={index}
                className={styles['time-string']}
                onClick={() => {
                  onSeek(match)
                }}
                title={`点击跳转到 ${match}`}
              >
                {match}
              </span>
            )
          } else {
            return <React.Fragment key={index}>{part}</React.Fragment>
          }
        })}
      </span>
    </>
  )
}

export default HighlightTimeStrings
