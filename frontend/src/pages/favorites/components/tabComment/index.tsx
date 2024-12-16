import React, { useEffect, useState } from 'react'
import { Avatar, Button, Card, Separator, Spinner } from '@radix-ui/themes'
import { BiLike, BiSolidLike } from 'react-icons/bi'
import './index.modules.scss'
import { commentCollectList } from '@/api/favorite'
import { FavoriteCommentType } from '@/types/comment'
import dayjs from 'dayjs'
import { ProfileModal } from '@/components'
import { toast } from '@/utils'
import { CONSTANT } from '@/types/constant'

const TabComment: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<{
    records: FavoriteCommentType[]
    loadMoreKey: string
  }>({
    records: [],
    loadMoreKey: '',
  })
  const [profileModal, setProfileModal] = useState<{
    open: boolean
    uid: string
  }>({
    open: false,
    uid: '',
  })

  const getLists = (loadMoreKey = '') => {
    setLoading(true)

    const params = {
      loadMoreKey,
    }
    commentCollectList(params)
      .then((res) =>
        setData({
          records: res.data.data,
          loadMoreKey: res.data.loadMoreKey,
        }),
      )
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getLists()
  }, [])

  return (
    <>
      <Spinner loading={loading}>
        {data.records.map((item) => (
          <Card
            className="favorites-comment-item"
            key={item.id}
          >
            <div className="top">
              <div className="comment-avatar">
                <Avatar
                  size="4"
                  src={item.author.avatar.picture.picUrl}
                  radius="full"
                  fallback={item.author.nickname}
                  onClick={() => {
                    if (item.author.isBlockedByViewer) {
                      return toast(CONSTANT.BLOCKED_BY_VIEWER)
                    }

                    setProfileModal({
                      open: true,
                      uid: item.author.uid,
                    })
                  }}
                />
              </div>
              <div className="comment-info">
                <p
                  onClick={() => {
                    if (item.author.isBlockedByViewer) {
                      return toast(CONSTANT.BLOCKED_BY_VIEWER)
                    }

                    setProfileModal({
                      open: true,
                      uid: item.author.uid,
                    })
                  }}
                >
                  {item.author.nickname}
                </p>
                <p>
                  {dayjs(item.collectedAt).format('MM/DD')} {item.ipLoc}
                </p>
                <p>{item.text}</p>
              </div>
              <div className="comment-like">
                {item.liked ? <BiSolidLike /> : <BiLike />}
                {item.likeCount}
              </div>
            </div>

            <Separator
              my="3"
              size="4"
            />

            <div className="bottom">
              <div className="episode-cover">
                <Avatar
                  size="2"
                  src={
                    item.episode.image
                      ? item.episode.image.picUrl
                      : item.episode.podcast.image.picUrl
                  }
                  radius="small"
                  fallback={item.episode.title}
                />
              </div>
              <div className="episode-info">
                <p>{item.episode.title}</p>
                <p>{item.episode.podcast.title}</p>
              </div>
            </div>
          </Card>
        ))}

        <div className="load-more-button">
          <Button
            color="gray"
            onClick={() => {
              getLists(data.loadMoreKey)
            }}
          >
            加载更多
          </Button>
        </div>

        <ProfileModal
          uid={profileModal.uid}
          open={profileModal.open}
          onClose={() => {
            setProfileModal({
              open: false,
              uid: '',
            })
          }}
        />
      </Spinner>
    </>
  )
}

export default TabComment
