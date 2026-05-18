import React, { useEffect, useState } from 'react'
import { Spinner, Button, Card } from '@radix-ui/themes'
import { Modal } from '@/components'
import { modalType } from '@/types/modal'
import { podcastDetail } from '@/api/podcast'
import { PodcastType } from '@/types/podcast'
import { useSystemTheme, useWindowSize } from '@/hooks'
import styles from './index.module.scss'
import { PlusIcon, ExternalLinkIcon } from '@radix-ui/react-icons'
import { DialogType, ShowMessageDialog, toast } from '@/utils'
import { updateSubscription } from '@/api/subscription'
import dayjs from 'dayjs'
import { ThemeMode } from '@/layouts/theme'
import { CONSTANT } from '@/types/constant'
import { BrowserOpenURL } from 'wailsjs/runtime'

type IProps = {
  pid: string
} & modalType

function onLinkClick(url: string): void {
  ShowMessageDialog(
    DialogType.QUESTION,
    '跳转提示',
    `是否在浏览器中打开链接？\r\n${url}`,
  ).then((res) => {
    if (res === 'Yes' || res === '是') {
      BrowserOpenURL(url)
    }
  })
}

export const PodcastDetailModal: React.FC<IProps> = ({
  pid,
  open,
  onClose,
}) => {
  const theme: ThemeMode = useSystemTheme()
  const height = useWindowSize().height
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<PodcastType>()

  function fetchData(): void {
    setLoading(true)

    podcastDetail({
      pid,
    })
      .then((res) => {
        setData(res.data.data)
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
              fetchData()
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
            fetchData()
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
      setData(undefined)
    }
  }, [open])

  return (
    <Modal
      title="节目详情"
      open={open}
      onClose={onClose}
      backgroundImage={data?.image.picUrl}
      options={
        <>
          <Button
            variant="soft"
            onClick={() => {
              onUpdateSubscription(
                data?.pid || '',
                data?.title || '',
                data?.subscriptionStatus === 'ON' ? 'OFF' : 'ON',
              )
            }}
            color={data?.subscriptionStatus === 'ON' ? 'gray' : undefined}
          >
            {data?.subscriptionStatus === 'ON' ? null : <PlusIcon />}
            {data?.subscriptionStatus === 'ON' ? '已订阅' : '订阅'}
          </Button>
          <Button
            variant="soft"
            color="gray"
          >
            <ExternalLinkIcon />
            查看单集
          </Button>
        </>
      }
    >
      <Spinner loading={loading}>
        <div style={{ maxHeight: height * 0.6, overflowY: 'auto' }}>
          <div className={styles['top']}>
            <img
              className={styles['podcast-cover']}
              src={data?.image.picUrl}
              alt={data?.title}
            />

            <div className={styles['podcast-info']}>
              <h2 title={data?.title}>{data?.title}</h2>
              <p title={data?.brief}>{data?.brief}</p>
              <div className={styles['subscription']}>
                {`${data?.subscriptionCount} 人订阅 · ${dayjs(data?.latestEpisodePubDate).format('YYYY/MM/DD')} 更新`}
              </div>
            </div>
          </div>

          <div className={styles['podcast-description']}>
            <pre>{data?.description}</pre>
          </div>

          <div
            className={styles['part-title']}
            style={{
              color: theme === 'dark' ? data?.color.dark : data?.color.light,
            }}
          >
            节目荣誉墙
          </div>

          {data?.contacts && data?.contacts.length > 0 && (
            <React.Fragment>
              <div
                className={styles['part-title']}
                style={{
                  color:
                    theme === 'dark' ? data?.color.dark : data?.color.light,
                }}
              >
                联系方式
              </div>

              <Card>
                {data?.contacts?.map((item) => {
                  switch (item.type) {
                    case CONSTANT.CONTACTS_WECHAT:
                      return (
                        <p
                          key={item.type}
                          className={styles['contacts-item']}
                        >
                          <span
                            style={{
                              color:
                                theme === 'dark'
                                  ? data?.color.dark
                                  : data?.color.light,
                            }}
                          >
                            {item.note || '添加微信'}：
                          </span>
                          <span>{item.name}</span>
                        </p>
                      )

                    case CONSTANT.CONTACTS_WECHAT_OFFICIAL_ACCOUNTS:
                      return (
                        <p
                          key={item.type}
                          className={styles['contacts-item']}
                        >
                          <span
                            style={{
                              color:
                                theme === 'dark'
                                  ? data?.color.dark
                                  : data?.color.light,
                            }}
                          >
                            {item.note}：
                          </span>
                          <span>{item.name}</span>
                        </p>
                      )

                    case CONSTANT.CONTACTS_WEIBO:
                      return (
                        <p
                          key={item.type}
                          className={styles['contacts-item']}
                        >
                          <span
                            style={{
                              color:
                                theme === 'dark'
                                  ? data?.color.dark
                                  : data?.color.light,
                            }}
                          >
                            微博：
                          </span>
                          <span
                            className={styles['link']}
                            onClick={() => onLinkClick(item?.url || '')}
                            style={{
                              color:
                                theme === 'dark'
                                  ? data?.color.dark
                                  : data?.color.light,
                            }}
                          >
                            {item.name}
                          </span>
                        </p>
                      )

                    case CONSTANT.CONTACTS_JIKE:
                      return (
                        <p
                          key={item.type}
                          className={styles['contacts-item']}
                        >
                          <span
                            style={{
                              color:
                                theme === 'dark'
                                  ? data?.color.dark
                                  : data?.color.light,
                            }}
                          >
                            即刻：
                          </span>
                          <span
                            className={styles['link']}
                            onClick={() => onLinkClick(item?.url || '')}
                            style={{
                              color:
                                theme === 'dark'
                                  ? data?.color.dark
                                  : data?.color.light,
                            }}
                          >
                            {item.name}
                          </span>
                        </p>
                      )

                    case CONSTANT.CONTACTS_EMAIL:
                      return (
                        <p
                          key={item.type}
                          className={styles['contacts-item']}
                        >
                          <span
                            style={{
                              color:
                                theme === 'dark'
                                  ? data?.color.dark
                                  : data?.color.light,
                            }}
                          >
                            {item.note || '邮箱'}：
                          </span>
                          <span>{item.name}</span>
                        </p>
                      )

                    case CONSTANT.CONTACTS_CUSTOM:
                      return (
                        <p
                          key={item.type}
                          className={styles['contacts-item']}
                        >
                          <span
                            style={{
                              color:
                                theme === 'dark'
                                  ? data?.color.dark
                                  : data?.color.light,
                            }}
                          >
                            链接：
                          </span>
                          <span
                            className={styles['link']}
                            onClick={() => onLinkClick(item?.url || '')}
                            style={{
                              color:
                                theme === 'dark'
                                  ? data?.color.dark
                                  : data?.color.light,
                            }}
                          >
                            {item.name}
                          </span>
                        </p>
                      )
                  }
                })}
              </Card>
            </React.Fragment>
          )}
        </div>
      </Spinner>
    </Modal>
  )
}
