import React from 'react'
import { ColorfulShadow } from '@/components'
import { QuoteIcon, UpdateIcon } from '@radix-ui/react-icons'
import { Button, Skeleton } from '@radix-ui/themes'
import './index.modules.scss'
import { PopularType, TargetType } from '@/pages/home'

type IProps = {
  data: PopularType
  loading: boolean
  onRefresh: () => void
}

/**
 * 发现-大家都在听
 * @constructor
 */
const PopularPart: React.FC<IProps> = ({ data, loading, onRefresh }) => {
  return (
    <div className="popular-layout">
      <h3>大家都在听</h3>

      <Skeleton loading={loading}>
        <div className="popular-content">
          {data?.target?.map((item: TargetType) => (
            <div
              className="popular-item"
              key={item.episode.eid}
            >
              <div className="popular-info">
                <div className="cover-box">
                  <ColorfulShadow
                    src={
                      item.episode?.image
                        ? item.episode.image.picUrl
                        : item.episode.podcast.image.picUrl
                    }
                    mask
                    curPointer
                  />
                </div>
                <div className="info-box">
                  <p>{item.episode.podcast.title}</p>
                  <p>{item.episode.title}</p>
                  <p>
                    <QuoteIcon />
                    {item.recommendation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Skeleton>

      <div className="reload-button">
        <Button
          size="1"
          variant="soft"
          onClick={() => onRefresh()}
        >
          <UpdateIcon />
          换一换
        </Button>
      </div>
    </div>
  )
}

export default PopularPart
