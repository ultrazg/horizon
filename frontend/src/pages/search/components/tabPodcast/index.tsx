import React from 'react'
import './index.modules.scss'
import { ColorfulShadow } from '@/components'
import { Button } from '@radix-ui/themes'
import { PlusIcon } from '@radix-ui/react-icons'
import { PodcastType } from '@/types/podcast'
import dayjs from 'dayjs'
import { isEmpty } from 'lodash'
import { updateSubscription } from '@/api/subscription'
import { DialogType, ShowMessageDialog, toast } from '@/utils'

type IProps = {
  data: { records: PodcastType[]; loadMoreKey: {} }
  loading: boolean
  onLoadMore: (loadMoreKey: {}) => void
  onRefresh: () => void
}

export const TabPodcast: React.FC<IProps> = ({
  data,
  onLoadMore,
  loading,
  onRefresh,
}) => {
  /**
   * 更新订阅
   * @param pid 节目id
   * @param podcastTitle 节目标题
   * @param mode 是否订阅
   */
  const onUpdateSubscription = (
    pid: string,
    podcastTitle: string,
    mode: 'ON' | 'OFF',
  ) => {
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
            .then(() =>
              toast(toastText, { duration: 1000 }, () => {
                onRefresh()
              }),
            )
            .catch(() => {
              toast('操作失败')
            })
        }
      })
    } else {
      updateSubscription(params)
        .then((res) => {
          toast(toastText, { duration: 1000 }, () => {
            onRefresh()
          })
        })
        .catch(() => {
          toast('操作失败')
        })
    }
  }

  return (
    <div className="search-result-podcast-layout">
      {data.records.length === 0 && (
        <div
          style={{
            width: '100%',
            color: 'gray',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          暂无数据
        </div>
      )}
      {data.records.map((item) => (
        <div
          className="search-result-podcast-item"
          key={item.pid}
        >
          <div className="left">
            <ColorfulShadow
              className="podcast-cover"
              curPointer
              src={item?.image?.picUrl}
            />

            <div className="podcast-info">
              <p>{item.title}</p>
              <p>{item.description}</p>
              <p>
                {item.author} ·{' '}
                {dayjs(item.latestEpisodePubDate).format('MM/DD')}更新
              </p>
            </div>
          </div>
          <div className="right">
            <Button
              variant="soft"
              color={item.subscriptionStatus === 'ON' ? 'gray' : undefined}
              onClick={() => {
                onUpdateSubscription(
                  item.pid,
                  item.title,
                  item.subscriptionStatus === 'ON' ? 'OFF' : 'ON',
                )
              }}
            >
              {item.subscriptionStatus === 'ON' ? null : <PlusIcon />}
              {item.subscriptionStatus === 'ON' ? '已订阅' : '订阅'}
            </Button>
          </div>
        </div>
      ))}

      <div className="podcast-load-more-button">
        {!isEmpty(data.loadMoreKey) && (
          <Button
            color="gray"
            onClick={() => {
              onLoadMore(data.loadMoreKey)
            }}
            loading={loading}
          >
            加载更多
          </Button>
        )}
      </div>
    </div>
  )
}
