import React, { useEffect, useState } from 'react'
import { BsPlayFill, BsPauseFill } from 'react-icons/bs'
import { Spinner, Tooltip } from '@radix-ui/themes'
import { HeartIcon, HeartFilledIcon } from '@radix-ui/react-icons'
import FF_BUTTON_ICON from '@/assets/images/ff-button.png'
import RW_BUTTON_ICON from '@/assets/images/rw-button.png'
import './index.modules.scss'
import { Player, toast } from '@/utils'
import { PlayInfoType } from '@/utils/player'
import { CONSTANT } from '@/types/constant'
import { favoriteEpisodeUpdate } from '@/api/favorite'

type IProps = {
  player: Player
  playInfo: PlayInfoType
}

export const PlayerButtons: React.FC<IProps> = ({ player, playInfo }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(player.isPlaying)
  const [left, setLeft] = useState<boolean>(false)
  const [right, setRight] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

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

  useEffect(() => {
    setIsPlaying(player.isPlaying)
  }, [player.isPlaying])

  return (
    <div className="player-buttons-layout">
      <div className="buttons">
        <Tooltip
          content={
            playInfo.liked ? CONSTANT.PLAYER_UNLIKED : CONSTANT.PLAYER_LIKED
          }
        >
          <div
            className="button"
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
            className="button"
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
            className="button"
            onClick={() => {
              onPlay()
            }}
          >
            {!isPlaying ? <BsPlayFill /> : <BsPauseFill />}
          </div>
        </Tooltip>

        <Tooltip content={CONSTANT.PLAYER_FAST_FORWARD}>
          <div
            className="button"
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
      </div>
    </div>
  )
}
