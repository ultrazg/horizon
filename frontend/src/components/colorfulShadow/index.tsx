import React from 'react'
import './index.modules.scss'
import { PlayIcon } from '@radix-ui/react-icons'

type ColorfulShadowType = {
  className?: string
  style?: React.CSSProperties
  src: string
  mask?: boolean
  curPointer?: boolean
  onClick?: () => void
}

/**
 * 封面展示组件
 * @param className 类名
 * @param style React.CSSProperties
 * @param src 封面 url
 * @param mask 是否展示遮罩
 * @param curPointer 光标指针是否展示为「手型」
 * @param onClick 点击事件
 * @returns
 */
export const ColorfulShadow: React.FC<ColorfulShadowType> = ({
  className,
  style,
  src,
  mask = false,
  curPointer = false,
  onClick,
}): JSX.Element => {
  return (
    <div
      className={`colorful-shadow-layout ${className}`}
      style={style}
      onClick={onClick}
    >
      <div
        className="pic-box"
        style={{ cursor: `${curPointer ? 'pointer' : 'default'}` }}
      >
        <img
          src={src}
          className="origin_pic"
        />
        <img
          src={src}
          className="shadow"
        />
        {mask && (
          <div className="mask">
            <div className="circle">
              <PlayIcon />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
