import React from 'react'
import styles from './index.module.scss'
import { BsPlayFill, BsPlus } from 'react-icons/bs'
import { CONSTANT } from '@/types/constant'

type ColorfulShadowType = {
  className?: string
  style?: React.CSSProperties
  src: string
  mask?: boolean
  curPointer?: boolean
  circle?: boolean
  onClick?: () => void
  onAddToPlaylist?: () => void
}

/**
 * 封面展示组件
 * @param className 类名
 * @param style React.CSSProperties
 * @param src 封面 url
 * @param mask 是否展示遮罩
 * @param curPointer 光标指针是否展示为「手型」
 * @param circle 是否以圆形展示
 * @param onClick 点击事件
 * @param onAddToPlaylist 添加到播放列表事件
 * @returns
 */
export const ColorfulShadow: React.FC<ColorfulShadowType> = ({
  className,
  style,
  src,
  mask = false,
  curPointer = false,
  circle = false,
  onClick,
  onAddToPlaylist,
}): JSX.Element => {
  return (
    <div
      className={`${styles['colorful-shadow-layout']} ${className} ${circle ? styles['circle'] : ''}`}
      style={style}
    >
      <div
        className={`${styles['pic-box']} ${circle ? styles['circle'] : ''}`}
        style={{ cursor: `${curPointer ? 'pointer' : 'default'}` }}
      >
        <img
          src={src}
          className={`${styles['origin_pic']} ${circle ? styles['circle'] : ''}`}
          alt="origin_pic"
        />
        <img
          src={src}
          className={`${styles['shadow']} ${circle ? styles['circle'] : ''}`}
          alt="shadow"
        />
        {mask && (
          <div className={styles['mask']}>
            <div
              className={styles['play-button']}
              onClick={onClick}
            >
              <BsPlayFill />
            </div>

            <div
              className={styles['add-player-list-button']}
              title={CONSTANT.PLAYER_ADD_TO_PLAYLIST}
              onClick={(e) => {
                e.stopPropagation()
                onAddToPlaylist?.()
              }}
            >
              <BsPlus />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
