import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { useWindowSize } from '@/hooks'

type IProps = {
  episodeCover: string | undefined
  podcastCover: string | undefined
  open: boolean
}

export const CoverBox: React.FC<IProps> = ({
  open,
  episodeCover,
  podcastCover,
}) => {
  const [height] = React.useState<number>(useWindowSize().height - 35)
  const [toggle, setToggle] = useState<boolean>(false)

  const handleToggle = () => {
    setToggle(!toggle)
  }

  const cbEpisodeImage: React.CSSProperties = {
    top: 0,
    left: 0,
    width: `${height * 0.38}px`,
    height: `${height * 0.38}px`,
    transform: 'scale(1)',
    opacity: 1,
  }

  const cbEpisodeImageActive: React.CSSProperties = {
    top: 0,
    left: 0,
    width: `${height * 0.4}px`,
    height: `${height * 0.4}px`,
    transform: 'scale(0.2)',
    opacity: 0,
  }

  const cbPodcastImage: React.CSSProperties = {
    width: '3rem',
    height: '3rem',
    bottom: 0,
    right: 0,
  }
  const cbPodcastImageActive: React.CSSProperties = {
    width: '100%',
    height: '100%',
    bottom: 0,
    right: 0,
  }

  useEffect(() => {
    if (open && !toggle) {
      setTimeout(() => {
        setToggle(true)
      }, 1500)
    }
  }, [open])

  return (
    <div
      className={styles['cover-box-layout']}
      style={{ height: `${height * 0.4}px` }}
    >
      <div
        className={styles['cover-box']}
        style={{ width: `${height * 0.4}px`, height: `${height * 0.4}px` }}
        onClick={() => {
          handleToggle()
        }}
      >
        <img
          style={toggle ? cbEpisodeImage : cbEpisodeImageActive}
          src={episodeCover}
          alt="cover-image"
        />
        <img
          style={toggle ? cbPodcastImage : cbPodcastImageActive}
          src={podcastCover}
          alt="cover-image"
        />
      </div>
    </div>
  )
}
