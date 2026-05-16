import React, { useEffect, useState } from 'react'
import { Button } from '@radix-ui/themes'
import { UpdateIcon, PlusIcon } from '@radix-ui/react-icons'
import { Modal, Empty, ColorfulShadow } from '@/components'
import { modalType } from '@/types/modal'
import { perspectiveType } from '@/types/user'
import { subscription, updateSubscription } from '@/api/subscription'
import { PodcastType } from '@/types/podcast'
import { useWindowSize } from '@/hooks'
import dayjs from 'dayjs'
import styles from './index.module.scss'
import { DialogType, ShowMessageDialog, toast } from '@/utils'

type IProps = {
  uid: string
  perspective: perspectiveType
} & modalType

export const SubscriptionModal: React.FC<IProps> = ({
  uid,
  open,
  onClose,
  perspective,
}) => {
  const width = useWindowSize().width
  const height = useWindowSize().height * 0.6
  const [loading, setLoading] = useState<boolean>(false)
  const [records, setRecords] = useState<PodcastType[]>([])
  const [loadMoreKey, setLoadMoreKey] = useState<{ skip: number }>({
    skip: 0,
  })

  function fetchData(loadMoreKey?: { skip: number }): void {
    setLoading(true)

    subscription({
      uid,
      loadMoreKey,
    })
      .then((res) => {
        setRecords([...records, ...res.data.data])
        if (res.data?.loadMoreKey) {
          setLoadMoreKey({
            skip: res.data.loadMoreKey.skip,
          })
        } else {
          setLoadMoreKey({
            skip: 0,
          })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  /**
   * 更新订阅
   * @param pid 节目id
   * @param podcastTitle 节目标题
   * @param mode 是否订阅
   */
  function onUpdateSubscription(
    pid: string,
    podcastTitle: string,
    mode: 'ON' | 'OFF',
  ): void {
    const params = {
      pid,
      mode,
    }
    let toastText = '订阅成功'

    if (mode === 'OFF') {
      toastText = '取消订阅成功'
      ShowMessageDialog(
        DialogType.QUESTION,
        '提示',
        `确定不再订阅「${podcastTitle}」吗？`,
      ).then((res) => {
        if (res === 'Yes' || res === '是') {
          updateSubscription(params)
            .then(() => {
              toast(toastText, { duration: 1000 })
              const temp: PodcastType[] = records.map((item) => {
                if (item.pid === pid) {
                  return {
                    ...item,
                    subscriptionStatus: 'OFF',
                    subscriptionCount: item.subscriptionCount - 1,
                  }
                }
                return item
              })
              setRecords(temp)
            })
            .catch(() => {
              toast('操作失败')
            })
        }
      })
    } else {
      updateSubscription(params)
        .then(() => {
          toast(toastText, { duration: 1000 }, () => {
            const temp: PodcastType[] = records.map((item) => {
              if (item.pid === pid) {
                return {
                  ...item,
                  subscriptionStatus: 'ON',
                  subscriptionCount: item.subscriptionCount + 1,
                }
              }
              return item
            })
            setRecords(temp)
          })
        })
        .catch(() => {
          toast('操作失败')
        })
    }
  }

  useEffect(() => {
    if (open) {
      fetchData()
    }

    return () => {
      setRecords([])
      setLoadMoreKey({
        skip: 0,
      })
    }
  }, [open])

  return (
    <Modal
      title={`${perspective}订阅的节目`}
      width={`${width * 0.7}px`}
      open={open}
      onClose={onClose}
      options={
        loadMoreKey.skip === 0 ? null : (
          <Button
            variant="soft"
            color="gray"
            onClick={() => {
              fetchData({ skip: loadMoreKey.skip })
            }}
            loading={loading}
          >
            <UpdateIcon />
            加载更多
          </Button>
        )
      }
    >
      {records.length === 0 ? (
        <Empty />
      ) : (
        <div
          style={{
            maxHeight: height,
            overflowY: 'scroll',
            padding: '18px 18px 0 18px',
          }}
        >
          {records.map((item) => (
            <div
              className={styles['chunk']}
              key={item.pid}
            >
              <div className={styles['left']}>
                <ColorfulShadow src={item.image.picUrl} />
              </div>
              <div className={styles['middle']}>
                <p title={item.title}>{item.title}</p>
                <p title={item.description}>{item.description}</p>
                <p>
                  {`${item.subscriptionCount} 人订阅 · ${dayjs(item.latestEpisodePubDate).format('YYYY/MM/DD')} 更新`}
                </p>
              </div>
              <div className={styles['right']}>
                <Button
                  onClick={() => {
                    onUpdateSubscription(
                      item.pid,
                      item.title,
                      item.subscriptionStatus === 'ON' ? 'OFF' : 'ON',
                    )
                  }}
                  variant="soft"
                  color={item.subscriptionStatus === 'ON' ? 'gray' : undefined}
                >
                  {item.subscriptionStatus === 'ON' ? null : <PlusIcon />}
                  {item.subscriptionStatus === 'ON' ? '已订阅' : '订阅'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}
