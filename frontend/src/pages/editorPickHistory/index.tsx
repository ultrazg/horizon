import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { Grid, Box, Avatar, Button } from '@radix-ui/themes'
import { PlayIcon, ChatBubbleIcon, QuoteIcon } from '@radix-ui/react-icons'
import { ColorfulShadow, Empty } from '@/components'
import {
  editorPickListHistory,
  type editorPickListHistoryType,
} from '@/api/pick'
import { EditorPickHistoryType } from '@/types/pick'

/**
 * 往日精选
 * @constructor
 */
export const EditorPickHistory: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadMoreKey, setLoadMoreKey] = useState<string>('')
  const [data, setData] = useState<EditorPickHistoryType[]>([])

  const fetchData = () => {
    const params: editorPickListHistoryType = {}

    if (loadMoreKey !== '') {
      params.loadMoreKey = loadMoreKey
    }

    setLoading(true)

    editorPickListHistory(params)
      .then((res) => {
        if (loadMoreKey !== '') {
          setData([...data, ...res.data.data])
        } else {
          setData(res.data.data)
        }
        setLoadMoreKey(res.data?.loadMoreKey)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className={styles['editor-pick-history-wrapper']}>
      {data.length === 0 && <Empty />}

      {data?.map((item) => (
        <div className={styles['part']}>
          <div className={styles['time']}>{item.date}</div>

          <div className={styles['content']}>
            <Grid
              columns={{ initial: '1', md: '2' }}
              gap="3"
              width="auto"
            >
              {item.picks.map((itm) => (
                <Box className={styles['chunks']}>
                  <div className={styles['top-chunk']}>
                    <div className={styles['episode-avatar']}>
                      <ColorfulShadow
                        src={
                          itm.episode.image
                            ? itm.episode.image.picUrl
                            : itm.episode.podcast.image.picUrl
                        }
                        mask
                        curPointer
                      />
                    </div>
                    <div className={styles['episode-info']}>
                      <p>{itm.episode.podcast.title}</p>
                      <p>{itm.episode.title}</p>
                    </div>
                  </div>
                  <div className={styles['bottom-chunk']}>
                    <div
                      className={styles['comment']}
                      title={`@${itm.comment.author.nickname}：${itm.comment.text}`}
                    >
                      <span>@{itm.comment.author.nickname}</span>：
                      {itm.comment.text}
                      <QuoteIcon />
                    </div>

                    <div className={styles['listen-data']}>
                      <div className={styles['avatar-group']}>
                        {itm.recentAudiences.map((i) => (
                          <Avatar
                            className={styles['avatar']}
                            src={i.avatar.picture.picUrl}
                            size="2"
                            fallback={'avatar'}
                            radius={'full'}
                          />
                        ))}
                        <span>听过</span>
                      </div>
                      <div className={styles['listen-count']}>
                        <span>
                          <PlayIcon />
                          {itm.episode.playCount}
                        </span>
                        <span>
                          <ChatBubbleIcon />
                          {itm.episode.commentCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </Box>
              ))}
            </Grid>
          </div>
        </div>
      ))}

      <div className={styles['load-more-button']}>
        <Button
          color="gray"
          onClick={() => {
            fetchData()
          }}
          loading={loading}
        >
          加载更多
        </Button>
      </div>
    </div>
  )
}
