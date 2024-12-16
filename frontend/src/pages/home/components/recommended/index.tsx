import React from 'react'
import { Box, Flex, ScrollArea } from '@radix-ui/themes'
import './index.moduless.scss'
import { ColorfulShadow } from '@/components'
import { useNavigate } from 'react-router-dom'
import { RecommendedType } from '@/pages/home'

type IProps = {
  data: RecommendedType
  loading: boolean
}

const Recommended: React.FC<IProps> = ({ data, loading }) => {
  const navigateTo = useNavigate()
  const goPodcastDetail = (pid: string) => {
    navigateTo('/podcast/detail', {
      state: {
        pid,
      },
    })
  }

  return (
    <div className="recommended-layout">
      <h3>精选节目</h3>

      <div className="recommended-content">
        <ScrollArea
          size="2"
          type="hover"
          scrollbars="horizontal"
        >
          <Flex
            gap="1"
            width="700px"
          >
            {data?.target?.map((item) => (
              <Box key={item.podcast.pid}>
                <div className="recommended-item">
                  <div className="cover-box">
                    <ColorfulShadow
                      className="cover"
                      src={item.podcast.image.picUrl}
                      curPointer
                      onClick={() => {
                        goPodcastDetail(item.podcast.pid)
                      }}
                    />
                  </div>

                  <div className="podcast-info">
                    <div className="podcast-title">{item.podcast.title}</div>
                  </div>
                </div>
              </Box>
            ))}
          </Flex>
        </ScrollArea>
      </div>
    </div>
  )
}

export default Recommended
