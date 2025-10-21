import React from 'react'
import { Spinner } from '@radix-ui/themes'
import { CaretUpIcon } from '@radix-ui/react-icons'
import styles from './index.module.scss'
import { Player } from '@/utils'
import COVER_PLACEHOLDER from '@/assets/images/cover-placeholder.png'
import { PlayInfoType } from '@/utils/player'
import { CONSTANT } from '@/types/constant'

interface IProps {
  player: Player
  playInfo: PlayInfoType
  playerLoading: boolean
  onOpen: () => void
}

export const secondsToHms = (seconds: number): string => {
  const h: number = Math.floor(seconds / 3600)
  const m: number = Math.floor((seconds % 3600) / 60)
  const s: number = seconds % 60
  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export const EpisodeCover: React.FC<IProps> = ({
  player,
  playInfo,
  playerLoading,
  onOpen,
}) => {
  return (
    <>
      <div className={styles['episode-cover-layout']}>
        <Spinner
          size="3"
          loading={playerLoading}
        >
          <div className={styles['episode-cover']}>
            <img
              src={playInfo.cover ? playInfo.cover : COVER_PLACEHOLDER}
              alt="episode-cover"
              draggable={false}
            />
            <div
              className={styles['mask']}
              onClick={() => {
                if (player.playInfo.eid != '') {
                  onOpen()
                }
              }}
            >
              <CaretUpIcon style={{ width: 50, height: 50 }} />
            </div>
          </div>
        </Spinner>

        <div className={styles['episode-info']}>
          <div className={styles['episode-title']}>
            <h4 title={playInfo.title || CONSTANT.NO_PLAY}>
              {playInfo.title || CONSTANT.NO_PLAY}
            </h4>
          </div>
          <div className={styles['episode-info']}>
            <div>
              <span>{secondsToHms(Math.round(playInfo.current))}</span>
              <span>/</span>
              <span>{secondsToHms(Math.round(playInfo.duration))}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
