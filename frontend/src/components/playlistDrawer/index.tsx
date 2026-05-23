import React, { useEffect, useState } from 'react'
import { IconButton, Text, Tooltip } from '@radix-ui/themes'
import { Cross2Icon, PlayIcon, TrashIcon } from '@radix-ui/react-icons'
import styles from './index.module.scss'
import { usePlayer } from '@/hooks'
import { PlaylistItem } from '@/utils/player'

type IProps = {
  open: boolean
  onClose: () => void
}

export const PlaylistDrawer: React.FC<IProps> = ({ open, onClose }) => {
  const player = usePlayer()
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([])

  useEffect(() => {
    const update = () => {
      setPlaylist([...player.playlist])
    }

    update()

    return player.onPlaylistChange(update)
  }, [player])

  const handlePlay = (index: number) => {
    player.playFromPlaylist(index)
  }

  const handleRemove = (index: number) => {
    player.removeFromPlaylist(index)
  }

  const handleClear = () => {
    player.clearPlaylist()
  }

  return (
    <>
      {open && (
        <div
          className={styles['overlay']}
          onClick={onClose}
        />
      )}

      <div
        className={styles['playlist-drawer-layout']}
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div className={styles['header']}>
          <Text size="4" weight="bold">
            播放列表{playlist.length > 0 ? ` (${playlist.length})` : ''}
          </Text>
          <div className={styles['header-actions']}>
            {playlist.length > 0 && (
              <Tooltip content="清空列表">
                <IconButton
                  variant="ghost"
                  color="gray"
                  size="1"
                  onClick={handleClear}
                >
                  <TrashIcon />
                </IconButton>
              </Tooltip>
            )}
            <IconButton
              variant="ghost"
              color="gray"
              size="1"
              onClick={onClose}
            >
              <Cross2Icon />
            </IconButton>
          </div>
        </div>

        <div className={styles['list']}>
          {playlist.length === 0 ? (
            <div className={styles['empty']}>
              <Text size="2" color="gray">
                播放列表为空
              </Text>
            </div>
          ) : (
            playlist.map((item, index) => {
              const isCurrent =
                player.episodeInfo.eid === item.episodeInfo.eid
              return (
                <div
                  key={item.episodeInfo.eid + index}
                  className={`${styles['item']} ${isCurrent ? styles['active'] : ''}`}
                  onClick={() => handlePlay(index)}
                >
                  <div className={styles['item-cover']}>
                    {item.episodeInfo.cover && (
                      <img
                        src={item.episodeInfo.cover}
                        alt={item.episodeInfo.title}
                      />
                    )}
                  </div>
                  <div className={styles['item-info']}>
                    <Text
                      size="2"
                      className={styles['item-title']}
                      weight={isCurrent ? 'bold' : 'regular'}
                    >
                      {item.episodeInfo.title}
                    </Text>
                    {isCurrent && (
                      <Text size="1" color="blue">
                        正在播放
                      </Text>
                    )}
                  </div>
                  <div className={styles['item-actions']}>
                    {!isCurrent && (
                      <Tooltip content="播放">
                        <IconButton
                          variant="ghost"
                          color="gray"
                          size="1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePlay(index)
                          }}
                        >
                          <PlayIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip content="移除">
                      <IconButton
                        variant="ghost"
                        color="gray"
                        size="1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemove(index)
                        }}
                      >
                        <Cross2Icon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
