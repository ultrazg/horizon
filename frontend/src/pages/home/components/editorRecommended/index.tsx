import React from 'react'
import './index.modules.scss'
import { ColorfulShadow } from '@/components'
import { ChatBubbleIcon, PlayIcon } from '@radix-ui/react-icons'
import { Box, Flex, HoverCard, Text, Skeleton } from '@radix-ui/themes'
import { showEpisodeDetailModal } from '@/utils'

type IProps = {
  data: any
  loading: boolean
  onDetail: (pid: string) => void
}

const EditorRecommended: React.FC<IProps> = ({ data, loading, onDetail }) => {
  return (
    <div className="editor-recommended-layout">
      <h3>编辑精选</h3>

      <Skeleton loading={loading}>
        <div className="editor-recommended-content">
          {data?.picks?.map((item: any) => {
            return (
              <div
                className="editor-recommended-item"
                key={item.episode.eid}
              >
                <div className="editor-recommended-info">
                  <div className="cover-box">
                    <ColorfulShadow
                      src={item.episode.podcast.image.picUrl}
                      mask
                      curPointer
                    />
                  </div>
                  <HoverCard.Root>
                    <HoverCard.Trigger>
                      <div className="info-box">
                        <p
                          onClick={() => {
                            onDetail(item.episode.podcast.pid)
                          }}
                        >
                          {item.episode.podcast.title}
                        </p>
                        <p
                          onClick={() => {
                            showEpisodeDetailModal(item.episode.eid)
                          }}
                        >
                          {item.episode.title}
                        </p>
                        <p>
                          <span>
                            <PlayIcon />
                            {item.episode.playCount}
                          </span>
                          <span>
                            <ChatBubbleIcon />
                            {item.episode.commentCount}
                          </span>
                        </p>
                      </div>
                    </HoverCard.Trigger>
                    <HoverCard.Content
                      maxWidth="300px"
                      style={{
                        background: 'var(--black-a9)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                      }}
                    >
                      <Flex gap="1">
                        <Box>
                          {item.comment && (
                            <Text
                              as="div"
                              size="4"
                              color="gray"
                              mb="1"
                            >
                              @{item.comment.author.nickname}：
                            </Text>
                          )}

                          <Text
                            as="div"
                            size="3"
                          >
                            {item.comment
                              ? item.comment.text
                              : item.recommendation}
                          </Text>
                        </Box>
                      </Flex>
                    </HoverCard.Content>
                  </HoverCard.Root>
                </div>
              </div>
            )
          })}
        </div>
      </Skeleton>
    </div>
  )
}

export default EditorRecommended
