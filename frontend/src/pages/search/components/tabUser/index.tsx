import React from 'react'
import { Avatar, Button } from '@radix-ui/themes'
import { Empty } from '@/components'
import { baseUserType } from '@/types/user'
import { SlSymbleFemale, SlSymbolMale } from 'react-icons/sl'
import { isEmpty } from 'lodash'
import styles from './index.module.scss'
import { toast, ShowProfileModal } from '@/utils'
import { CONSTANT } from '@/types/constant'

type IProps = {
  data: { records: baseUserType[]; loadMoreKey: {} }
  onLoadMore: (loadMoreKey: {}) => void
  loading: boolean
}

export const TabUser: React.FC<IProps> = ({ data, onLoadMore, loading }) => {
  return (
    <>
      <div className={styles['search-result-user-layout']}>
        {data.records.length === 0 && <Empty />}
        {data.records.map((item) => (
          <div
            key={item.uid}
            className={styles['search-result-user-item']}
            onClick={() => {
              ShowProfileModal({
                uid: item.uid,
              }).catch(() => {
                toast(CONSTANT.ERROR_PROFILE_VIEW, {
                  type: 'warn',
                })
              })
            }}
          >
            <div className={styles['user-avatar']}>
              <Avatar
                className={styles['avatar-box']}
                src={item?.avatar?.picture?.picUrl}
                fallback={item.nickname}
              />
            </div>
            <div className={styles['user-info']}>
              <p>
                {item.nickname}
                {item?.gender === 'MALE' ? (
                  <SlSymbolMale
                    fontSize="16"
                    color="royalblue"
                    style={{ marginLeft: '6px' }}
                  />
                ) : null}
                {item?.gender === 'FEMALE' ? (
                  <SlSymbleFemale
                    fontSize="16"
                    color="pink"
                    style={{ marginLeft: '6px' }}
                  />
                ) : null}
              </p>
              <p className={styles['user-bio']}>{item.bio}</p>
            </div>
          </div>
        ))}

        <div className={styles['user-load-more-button']}>
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
    </>
  )
}
