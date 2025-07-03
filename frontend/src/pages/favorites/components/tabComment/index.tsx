import React, { useEffect, useState } from 'react'
import { Avatar, Button, Card, IconButton, Separator } from '@radix-ui/themes'
import { TrashIcon } from '@radix-ui/react-icons'
import { BiLike, BiSolidLike } from 'react-icons/bi'
import styles from './index.module.scss'
import { commentCollectList, commentCollectRemove } from '@/api/favorite'
import { FavoriteCommentType } from '@/types/comment'
import dayjs from 'dayjs'
import { ProfileModal } from '@/components'
import {
  DialogType,
  showEpisodeDetailModal,
  ShowMessageDialog,
  toast,
} from '@/utils'
import { CONSTANT } from '@/types/constant'
import { onCommentLikeUpdate } from '@/components/playerDrawer/components/episodeComment'

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

  /**
   * 获取收藏的评论数据
   * @param loadMoreKey
   */
  const getLists = (loadMoreKey = '') => {
    setLoading(true)

    const params = {
      loadMoreKey,
    }
    commentCollectList(params)
      .then((res) => {
        if (loadMoreKey) {
          setData({
            records: [...data.records, ...res.data.data],
            loadMoreKey: res.data.loadMoreKey,
          })
        } else {
          setData({
            records: res.data.data,
            loadMoreKey: res.data.loadMoreKey,
          })
        }
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  /**
   * 删除收藏的评论
   * @param commentId 评论 id
   */
  const onRemove = (commentId: string) => {
    ShowMessageDialog(
      DialogType.QUESTION,
      '提示',
      '确定要取消收藏这条评论吗？',
    ).then((res) => {
      if (res === 'Yes' || res === '是') {
        const params = {
          commentId,
        }

        commentCollectRemove(params)
          .then((res) => {
            toast(res.data.toast, { type: 'success' })
            getLists()
          })
          .catch(() => {
            toast('操作失败', { type: 'warn' })
          })
      }
    })
  }

  useEffect(() => {
    getLists()
  }, [])

  return (
    <>
      {data.records.map((item) => (
        <Card
          className={styles['favorites-comment-item']}
          key={item.id}
        >
          <div className={styles['top']}>
            <div className={styles['comment-avatar']}>
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
            <div className={styles['comment-info']}>
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
            </div>
            <div className={styles['remove-like']}>
              <IconButton
                size="1"
                color="red"
                variant="soft"
                onClick={() => {
                  onRemove(item.id)
                }}
              >
                <TrashIcon />
              </IconButton>
            </div>
            <div className={styles['comment-like']}>
              <IconButton
                size="1"
                variant="soft"
                mr="1"
                onClick={() => {
                  onCommentLikeUpdate(item.id, !item.liked, getLists)
                }}
              >
                {item.liked ? <BiSolidLike /> : <BiLike />}
              </IconButton>
              {item.likeCount}
            </div>
          </div>

          <div>
            <p>{item.text}</p>
          </div>

          <Separator
            my="3"
            size="4"
          />

          <div className={styles['bottom']}>
            <div
              className={styles['episode-cover']}
              onClick={() => {
                showEpisodeDetailModal(item.episode.eid)
              }}
            >
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
            <div className={styles['episode-info']}>
              <p
                onClick={() => {
                  showEpisodeDetailModal(item.episode.eid)
                }}
              >
                {item.episode.title}
              </p>
              <p>{item.episode.podcast.title}</p>
            </div>
          </div>
        </Card>
      ))}

      <div className={styles['load-more-button']}>
        <Button
          size="1"
          color="gray"
          onClick={() => {
            getLists(data.loadMoreKey)
          }}
          loading={loading}
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
    </>
  )
}

export default TabComment
