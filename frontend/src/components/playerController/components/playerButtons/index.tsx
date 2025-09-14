import React, { ChangeEvent, useEffect, useState } from 'react'
import { BsPlayFill, BsPauseFill } from 'react-icons/bs'
import { Spinner, Tooltip } from '@radix-ui/themes'
import { HeartIcon, HeartFilledIcon } from '@radix-ui/react-icons'
import FF_BUTTON_ICON from '@/assets/images/ff-button.png'
import RW_BUTTON_ICON from '@/assets/images/rw-button.png'
import styles from './index.module.scss'
import { Player, toast } from '@/utils'
import { PlayInfoType } from '@/utils/player'
import { CONSTANT } from '@/types/constant'
import { favoriteEpisodeUpdate } from '@/api/favorite'

type IProps = {
  player: Player
  playInfo: PlayInfoType
}

const PLAYER_SPEEDS = [
  {
    label: '0.5x',
    value: '0.5',
  },
  {
    label: '0.8x',
    value: '0.8',
  },
  {
    label: '1x',
    value: '1',
  },
  {
    label: '1.1x',
    value: '1.1',
  },
  {
    label: '1.2x',
    value: '1.2',
  },
  {
    label: '1.3x',
    value: '1.3',
  },
  {
    label: '1.5x',
    value: '1.5',
  },
  {
    label: '1.7x',
    value: '1.7',
  },
  {
    label: '2x',
    value: '2',
  },
  {
    label: '3x',
    value: '3',
  },
]

export const PlayerButtons: React.FC<IProps> = ({ player, playInfo }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(player.isPlaying)
  const [left, setLeft] = useState<boolean>(false)
  const [right, setRight] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [playbackRate, setPlaybackRate] = useState<string>('1')

  /**
   * 收藏
   * @param liked
   */
  const toggleLike = (liked: boolean) => {
    const params = {
      eid: playInfo.eid,
      favorited: liked,
    }

    setLoading(true)

    favoriteEpisodeUpdate(params)
      .then(() => {
        toast(liked ? '收藏成功' : '取消收藏成功')

        const newPlayInfo: PlayInfoType = {
          ...playInfo,
          liked,
        }

        player.updatePlayInfo(newPlayInfo)
      })
      .catch(() => {
        toast(liked ? '收藏失败' : '取消收藏失败')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onPlay = () => {
    player.togglePlay()
    setIsPlaying(player.isPlaying)
  }

  /**
   * 快进
   */
  const onFastForward = () => {
    player.skip(15)

    setRight(true)

    setTimeout(() => {
      setRight(false)
    }, 300)
  }

  /**
   * 快退
   */
  const onRewind = () => {
    player.skip(-15)

    setLeft(true)

    setTimeout(() => {
      setLeft(false)
    }, 300)
  }

  /**
   * 播放速度
   * @param e
   */
  const onSpeedChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (player.isPlaying) {
      player.setPlaybackRate(Number(e.target.value))
      setPlaybackRate(e.target.value)
    }
  }

  useEffect(() => {
    setIsPlaying(player.isPlaying)
  }, [player.isPlaying])

  useEffect(() => {
    setPlaybackRate(String(player.playbackRate))
  }, [player.playInfo.eid])

  return (
    <div className={styles['player-buttons-layout']}>
      <div className={styles['buttons']}>
        <Tooltip
          content={
            playInfo.liked ? CONSTANT.PLAYER_UNLIKED : CONSTANT.PLAYER_LIKED
          }
        >
          <div
            className={styles['button']}
            onClick={() => {
              if (playInfo.eid != '') {
                toggleLike(!playInfo.liked)
              } else {
                toast(CONSTANT.NO_PLAY)
              }
            }}
          >
            <Spinner loading={loading}>
              {playInfo.liked ? <HeartFilledIcon color="red" /> : <HeartIcon />}
            </Spinner>
          </div>
        </Tooltip>

        <Tooltip content={CONSTANT.PLAYER_REWIND}>
          <div
            className={styles['button']}
            onClick={() => {
              onRewind()
            }}
          >
            <img
              className={left ? 'rotateLeft' : ''}
              src={RW_BUTTON_ICON}
              alt="rewind"
            />
          </div>
        </Tooltip>

        <Tooltip
          content={isPlaying ? CONSTANT.PLAYER_PAUSE : CONSTANT.PLAYER_PLAY}
        >
          <div
            className={styles['button']}
            onClick={() => {
              onPlay()
            }}
          >
            {!isPlaying ? <BsPlayFill /> : <BsPauseFill />}
          </div>
        </Tooltip>

        <Tooltip content={CONSTANT.PLAYER_FAST_FORWARD}>
          <div
            className={styles['button']}
            onClick={() => {
              onFastForward()
            }}
          >
            <img
              className={right ? 'rotateRight' : ''}
              src={FF_BUTTON_ICON}
              alt="fast-forward"
            />
          </div>
        </Tooltip>

        <div className={styles['player-speed']}>
          <Tooltip content={CONSTANT.PLAYER_SPEED}>
            <select
              value={playbackRate}
              onChange={(value) => onSpeedChange(value)}
            >
              {PLAYER_SPEEDS.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
