import React, { useEffect, useState } from 'react'
import { AspectRatio, Box, Card, Grid, Text, Spinner } from '@radix-ui/themes'
import { subscription } from '@/api/subscription'
import dayjs from 'dayjs'
import './index.modules.scss'

// TODO: 分页
export const Subscription: React.FC = () => {
  const [lists, setLists] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * 获取订阅列表数据
   */
  const getData = () => {
    setLoading(true)
    subscription({})
      .then((res) => setLists(res.data.data))
      .catch((err) => {
        console.error(err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="subscription-layout">
      <h3>我的订阅{lists.length > 0 ? `(${lists.length})` : null}</h3>

      {loading ? (
        <Spinner size="3" />
      ) : lists.length === 0 ? (
        <div
          style={{
            width: '100%',
            height: '80%',
            color: 'gray',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          暂无数据
        </div>
      ) : (
        <Grid
          columns="4"
          gap="6"
          width="auto"
          mb="6"
        >
          {lists.map((item: any) => (
            <Box key={item.pid}>
              <Card
                className="podcast-cover"
                title={item.title}
              >
                <AspectRatio ratio={8 / 8}>
                  <img
                    src={item.image.picUrl}
                    className="podcast-img"
                    alt={item.title}
                  />
                </AspectRatio>

                <Text
                  mt="3"
                  className="podcast-title"
                  as="p"
                  size="4"
                >
                  {item.title}
                </Text>
                <Text
                  className="podcast-update-time"
                  as="p"
                  size="2"
                >
                  更新于{dayjs(item.latestEpisodePubDate).format('MM/DD')}
                </Text>
              </Card>
            </Box>
          ))}
        </Grid>
      )}
    </div>
  )
}
