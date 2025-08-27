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
const HighlightTimeStrings: React.FC<IProps> = React.memo(
  ({ text = '', player }) => {
    const timeRegex = /\b(\d{1,2}:)?\d{1,2}:\d{2}\b/g

    const parts = React.useMemo(() => text.split(timeRegex), [text])

    const matches = React.useMemo(() => text.match(timeRegex) || [], [text])

    let matchIndex = 0

    const onSeek = React.useCallback(
      (time: string) => {
        const nums = time.split(':').map(Number)
        let totalSeconds = 0
        if (nums.length === 2) {
          totalSeconds = nums[0] * 60 + nums[1]
        } else if (nums.length === 3) {
          totalSeconds = nums[0] * 3600 + nums[1] * 60 + nums[2]
        }

        player.seek(totalSeconds)
        if (!player.isPlaying) {
          player.play()
        }

        toast(`已跳转到 ${time}`, { type: 'info' })
      },
      [player],
    )

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
  },
  (prevProps, nextProps) => prevProps.text === nextProps.text,
)

export default HighlightTimeStrings
