import React, { useEffect, useState } from 'react'
import './index.modules.scss'
import { useDisplayInfo } from '@/hooks'

const TEMP_BACKGROUND_IMAGE: string =
  'https://image.xyzcdn.net/FnQ-E7VcqLbzqplvdVPGrQRGHmxC.jpg@large'
const TEMP_BACKGROUND_IMAGE_2: string =
  'https://image.xyzcdn.net/FqUrrUGD1YIaeVqrpn9MV0yPz_iY.jpg@large'

type IProps = {
  hasOpen: boolean
}

export const CoverBox: React.FC<IProps> = ({ hasOpen }) => {
  const [height] = React.useState<number>(useDisplayInfo().Height - 35)
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
    if (hasOpen && !toggle) {
      setTimeout(() => {
        setToggle(true)
      }, 1500)
    }
  }, [hasOpen])

  return (
    <div
      className="cover-box-layout"
      style={{ height: `${height * 0.4}px` }}
    >
      <div
        className="cover-box"
        style={{ width: `${height * 0.4}px`, height: `${height * 0.4}px` }}
        onClick={() => {
          handleToggle()
        }}
      >
        <img
          style={toggle ? cbEpisodeImage : cbEpisodeImageActive}
          src={TEMP_BACKGROUND_IMAGE}
          alt="cover-image"
        />
        <img
          style={toggle ? cbPodcastImage : cbPodcastImageActive}
          src={TEMP_BACKGROUND_IMAGE_2}
          alt="cover-image"
        />
      </div>
    </div>
  )
}
