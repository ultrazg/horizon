import React from 'react'
import { Box, Flex, ScrollArea, Skeleton } from '@radix-ui/themes'
import styles from './index.module.scss'
import { ColorfulShadow } from '@/components'
import { RecommendedType } from '@/pages/home'

type IProps = {
  data: RecommendedType
  loading: boolean
  onDetail: (pid: string) => void
}

const Recommended: React.FC<IProps> = ({ data, loading, onDetail }) => {
  return (
    <div className={styles['recommended-layout']}>
      <h3>精选节目</h3>

      <Skeleton loading={loading}>
        <div className={styles['recommended-content']}>
          <ScrollArea
            size="2"
            type="hover"
            scrollbars="horizontal"
          >
            <Flex
              gap="7"
              width="700px"
            >
              {data?.target?.map((item) => (
                <Box key={item.podcast.pid}>
                  <div className={styles['recommended-item']}>
                    <div className={styles['cover-box']}>
                      <ColorfulShadow
                        className={styles['cover']}
                        src={item.podcast.image.picUrl}
                        curPointer
                        onClick={() => {
                          onDetail(item.podcast.pid)
                        }}
                      />
                    </div>

                    <div className={styles['podcast-info']}>
                      <div className={styles['podcast-title']}>
                        {item.podcast.title}
                      </div>
                    </div>
                  </div>
                </Box>
              ))}
            </Flex>
          </ScrollArea>
        </div>
      </Skeleton>
    </div>
  )
}

export default Recommended
