import React from 'react'
import styles from './index.module.scss'
import { PlayIcon } from '@radix-ui/react-icons'

type ColorfulShadowType = {
  className?: string
  style?: React.CSSProperties
  src: string
  mask?: boolean
  curPointer?: boolean
  circle?: boolean
  onClick?: () => void
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
}): JSX.Element => {
  return (
    <div
      className={`${styles['colorful-shadow-layout']} ${className} ${circle ? styles['circle'] : ''}`}
      style={style}
      onClick={onClick}
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
            <div className={styles['circle']}>
              <PlayIcon />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
