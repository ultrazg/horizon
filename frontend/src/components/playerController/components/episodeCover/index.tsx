import React, { useState } from 'react'
import { CaretUpIcon } from '@radix-ui/react-icons'
import './index.modules.scss'

interface IProps {
  onOpen: () => void
}

export const EpisodeCover: React.FC<IProps> = (props) => {
  const [isPlay, setIsPlay] = useState<boolean>(false)

  return (
    <>
      <div className="episode-cover-layout">
        <div className="episode-cover">
          <img
            src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
            alt="episode-cover"
            draggable={false}
          />
          <div
            className="mask"
            onClick={() => {
              props.onOpen()
            }}
          >
            <CaretUpIcon style={{ width: 50, height: 50 }} />
          </div>
        </div>
        <div className="episode-info">
          <div className="episode-title">
            <h4>Episode Title</h4>
          </div>
          <div className="episode-info">
            <div>
              <span>0:00</span>
              <span>/</span>
              <span>12:00</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
