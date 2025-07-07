import React, { useEffect, useState } from 'react'
import { IconButton, Slider, Text, Tooltip } from '@radix-ui/themes'
import {
  CaretDownIcon,
  Cross1Icon,
  EnterFullScreenIcon,
  ExitFullScreenIcon,
  MinusIcon,
} from '@radix-ui/react-icons'
import { useDisplayInfo } from '@/hooks'
import { CoverBox } from './components/coverBox'
import { LiveCount } from './components/liveCount'
import { EpisodeComment } from './components/episodeComment'
import styles from './index.module.scss'
import { BsPauseFill, BsPlayFill } from 'react-icons/bs'
import { IoMdThumbsUp, IoMdInformationCircleOutline } from 'react-icons/io'
import { episodeDetail, episodeClapCreate } from '@/api/episode'
import { EpisodeType } from '@/types/episode'
import {
  APP_NAME,
  APP_VERSION,
  Player,
  showEpisodeDetailModal,
  toast,
} from '@/utils'
import { CONSTANT } from '@/types/constant'
import FF_BUTTON_ICON from '@/assets/images/ff-button-colorful.png'
import RW_BUTTON_ICON from '@/assets/images/rw-button-colorful.png'
import { PlayInfoType } from '@/utils/player'
import { secondsToHms } from '@/components/playerController/components/episodeCover'
import {
  Environment,
  Quit,
  WindowMinimise,
  WindowToggleMaximise,
} from 'wailsjs/runtime'
import { envType } from '@/types/env'

type IProps = {
  player: Player
  playInfo: PlayInfoType
  open: boolean
  onClose: () => void
}

export const PlayerDrawer: React.FC<IProps> = ({
  player,
  playInfo,
  open,
  onClose,
}) => {
  const [height] = React.useState<number>(useDisplayInfo().Height)
  const [width] = React.useState<number>(useDisplayInfo().Width)

  const [envInfo, setEnvInfo] = useState<envType>()
  const [episodeDetailInfo, setEpisodeDetailInfo] = useState<EpisodeType>()
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [left, setLeft] = useState<boolean>(false)
  const [right, setRight] = useState<boolean>(false)
  const [progress, setProgress] = React.useState<number>(0)
  const [isMaximised, setIsMaximised] = useState<boolean>(false)

  const toggleWindowMaximised = (): void => {
    WindowToggleMaximise()
    setIsMaximised(!isMaximised)
  }

  /**
   * 标记精彩时刻
   * @param eid
   */
  const onCreateClap = (eid: string) => {
    const params = {
      eid,
      timestamp: Math.round(playInfo.current),
      duration: Math.round(playInfo.duration),
    }

    episodeClapCreate(params)
      .then(() => {
        toast(
          `成功在 ${secondsToHms(Math.round(playInfo.current))} 处标记为精彩时刻`,
          { type: 'success' },
        )
      })
      .catch(() => {
        toast('标记精彩时刻失败', { type: 'warn' })
      })
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

  const onPlay = () => {
    player.togglePlay()
    setIsPlaying(player.isPlaying)
  }

  const getEpisodeDetail = () => {
    const params = {
      eid: playInfo.eid,
    }

    episodeDetail(params)
      .then((res) => {
        setEpisodeDetailInfo(res.data.data)
      })
      .catch(() => {
        toast('获取单集详情失败', { type: 'warn' })
      })
  }

  useEffect(() => {
    if (open) {
      getEpisodeDetail()

      Environment().then((res: envType) => {
        setEnvInfo(res)
      })
    }
  }, [open])

  useEffect(() => {
    setProgress(Math.round(playInfo.current))
    setIsPlaying(player.isPlaying)
  }, [playInfo])

  return (
    <div
      style={{
        // width,
        // height: envInfo?.platform === 'darwin' ? height - 50 : height,
        paddingTop: envInfo?.platform === 'darwin' ? 50 : 0,
        transform: open
          ? `translateY(-${height}px)`
          : `translateY(${height}px)`,
      }}
      className={styles['player-drawer-layout']}
    >
      {envInfo?.platform !== 'darwin' && (
        <>
          <div className={styles['title-bar-text']}>
            {APP_NAME} v{APP_VERSION}
          </div>
          <div
            className={styles['title-bar-button']}
            style={
              {
                '--wails-draggable': 'none',
              } as any
            }
          >
            <div
              onClick={() => {
                WindowMinimise()
              }}
              title="最小化"
            >
              <MinusIcon />
            </div>
            <div
              onClick={() => {
                toggleWindowMaximised()
              }}
              title={isMaximised ? '还原' : '最大化'}
            >
              {isMaximised ? <ExitFullScreenIcon /> : <EnterFullScreenIcon />}
            </div>
            <div
              onClick={() => {
                Quit()
              }}
              title="退出"
            >
              <Cross1Icon />
            </div>
          </div>
        </>
      )}

      <div
        className={styles['player-background-image']}
        style={{
          background: `url(${episodeDetailInfo?.image ? episodeDetailInfo.image.picUrl : episodeDetailInfo?.podcast.image.picUrl}) no-repeat center center / cover`,
        }}
      />

      <div
        style={{ '--wails-draggable': 'drag' } as any}
        className={styles['close-button']}
      >
        <IconButton
          onClick={onClose}
          variant="ghost"
          mt="1"
          color="gray"
          radius="full"
        >
          <CaretDownIcon
            width={30}
            height={30}
          />
        </IconButton>
        <LiveCount
          open={open}
          eid={playInfo.eid}
          pid={player.episodeInfo.pid}
        />
      </div>

      <div
        className={styles['player-content']}
        style={{ height: `${height - 80}px` }}
      >
        <div className={styles['player-left']}>
          <div className={styles['player-left-content']}>
            <CoverBox
              open={open}
              episodeCover={
                episodeDetailInfo?.image
                  ? episodeDetailInfo.image.picUrl
                  : episodeDetailInfo?.podcast.image.picUrl
              }
              podcastCover={episodeDetailInfo?.podcast.image.picUrl}
            />
            <Text
              as="p"
              size="7"
              mt="4"
              mb="1"
              align="center"
              className={styles['episode-name']}
            >
              {episodeDetailInfo?.title}
            </Text>
            <Text
              as="p"
              align="center"
              size="5"
              mb="6"
              className={styles['podcast-name']}
            >
              {episodeDetailInfo?.podcast.title}
            </Text>

            <div className={styles['control-button-layout']}>
              <div>
                <Tooltip content="单集详情">
                  <IconButton
                    variant="ghost"
                    radius="large"
                    className={styles['control-button']}
                    onClick={() => {
                      showEpisodeDetailModal(playInfo.eid)
                    }}
                  >
                    <IoMdInformationCircleOutline />
                  </IconButton>
                </Tooltip>

                <Tooltip content={CONSTANT.PLAYER_REWIND}>
                  <IconButton
                    variant="ghost"
                    radius="large"
                    className={styles['control-button']}
                    onClick={() => {
                      onRewind()
                    }}
                  >
                    <img
                      className={left ? 'rotateLeft' : ''}
                      src={RW_BUTTON_ICON}
                      alt="icon"
                    />
                  </IconButton>
                </Tooltip>

                <Tooltip
                  content={
                    isPlaying ? CONSTANT.PLAYER_PAUSE : CONSTANT.PLAYER_PLAY
                  }
                >
                  <IconButton
                    variant="ghost"
                    radius="large"
                    className={styles['control-button']}
                    onClick={() => {
                      onPlay()
                    }}
                  >
                    {!isPlaying ? <BsPlayFill /> : <BsPauseFill />}
                  </IconButton>
                </Tooltip>

                <Tooltip content={CONSTANT.PLAYER_FAST_FORWARD}>
                  <IconButton
                    variant="ghost"
                    radius="large"
                    className={styles['control-button']}
                    onClick={() => {
                      onFastForward()
                    }}
                  >
                    <img
                      className={right ? 'rotateRight' : ''}
                      src={FF_BUTTON_ICON}
                      alt="icon"
                    />
                  </IconButton>
                </Tooltip>

                <Tooltip content={CONSTANT.CREATE_EPISODE_CLAP}>
                  <IconButton
                    variant="ghost"
                    radius="large"
                    className={styles['control-button']}
                    onClick={() => {
                      onCreateClap(playInfo.eid)
                    }}
                  >
                    <IoMdThumbsUp />
                  </IconButton>
                </Tooltip>
              </div>
            </div>

            <div className={styles['progress-bar-layout']}>
              <div className={styles['time-flag']}>
                <span>{secondsToHms(Math.round(playInfo.current))}</span>
                <span>{secondsToHms(Math.round(playInfo.duration))}</span>
              </div>
              <div className={styles['progress-bar']}>
                <Slider
                  className={styles['progress-slider']}
                  size="1"
                  step={1}
                  radius="full"
                  min={0}
                  max={Math.round(playInfo.duration)}
                  value={[progress]}
                  onValueChange={(value) => {
                    setProgress(value[0])
                    player.seek(value[0])
                  }}
                  defaultValue={[0]}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles['player-right']}>
          <EpisodeComment
            eid={playInfo.eid}
            open={open}
          />
        </div>
      </div>
    </div>
  )
}
