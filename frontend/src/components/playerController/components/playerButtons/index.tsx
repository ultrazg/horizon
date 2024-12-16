import React, { useState } from 'react'
import {
  BsPlayFill,
  BsPauseFill,
  BsSkipBackwardFill,
  BsSkipForwardFill,
} from 'react-icons/bs'
import { Tooltip } from '@radix-ui/themes'
import { HeartIcon } from '@radix-ui/react-icons'
import './index.modules.scss'

export const PlayerButtons = ( props:any ) => {
  const [playStatus, setPlayStatus] = useState(true)

  const handlePlay = () => {
    props.onHandleMusic(playStatus ? 'play':'pause')
    setPlayStatus(!playStatus)
    console.log("播放状态：",playStatus)
  }

  return (
    <div className="player-buttons-layout">
      <div className="buttons">
        <Tooltip content="喜欢">
          <div className="button">
            <HeartIcon />
          </div>
        </Tooltip>

        <Tooltip content="上一首">
          <div className="button" onClick={() => props.onHandleMusic('prev')}>
            <BsSkipBackwardFill />
          </div>
        </Tooltip>

        <Tooltip content="播放">
          <div className="button" onClick={() => handlePlay()}>
            {
              playStatus ? <BsPlayFill /> : <BsPauseFill />
            }
          </div>
        </Tooltip>

        <Tooltip content="下一首">
          <div className="button"  onClick={() => props.onHandleMusic('next')}>
            <BsSkipForwardFill />
          </div>
        </Tooltip>
      </div>
    </div>
  )
}
