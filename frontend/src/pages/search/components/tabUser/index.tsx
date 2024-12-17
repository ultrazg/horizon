import React, { useState } from 'react'
import { Avatar, Button } from '@radix-ui/themes'
import { ProfileModal } from '@/components'
import { baseUserType } from '@/types/user'
import { SlSymbleFemale, SlSymbolMale } from 'react-icons/sl'
import { isEmpty } from 'lodash'
import './index.modules.scss'

type IProps = {
  data: { records: baseUserType[]; loadMoreKey: {} }
  onLoadMore: () => void
}

export const TabUser: React.FC<IProps> = ({ data, onLoadMore }) => {
  const [profileModal, setProfileModal] = useState<{
    open: boolean
    uid: string
  }>({
    open: false,
    uid: '',
  })

  return (
    <>
      <div className="search-result-user-layout">
        {data.records.length === 0 && (
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
        )}
        {data.records.map((item) => (
          <div
            key={item.uid}
            className="search-result-user-item"
            onClick={() => {
              setProfileModal({
                open: true,
                uid: item.uid,
              })
            }}
          >
            <div className="user-avatar">
              <Avatar
                className="avatar-box"
                src={item?.avatar?.picture?.picUrl}
                fallback={item.nickname}
              />
            </div>
            <div className="user-info">
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
              <p className="user-bio">{item.bio}</p>
            </div>
          </div>
        ))}

        <div className="user-load-more-button">
          {!isEmpty(data.loadMoreKey) && <Button color="gray">加载更多</Button>}
        </div>
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