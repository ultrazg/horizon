import React, { useEffect, useState } from 'react'
import { Modal } from '@/components'
import './index.modules.scss'
import { modalType } from '@/types/modal'
import {
  Avatar,
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  ScrollArea,
  Spinner,
  Text,
} from '@radix-ui/themes'
import {
  blockedUserLists,
  blockedUserRemove,
  blockedUserCreate,
} from '@/api/blocked'
import { imageType } from '@/types/image'
import { genderType } from '@/types/user'
import { toast } from '@/utils'
import { SlSymbleFemale, SlSymbolMale } from 'react-icons/sl'
import { useDisplayInfo } from '@/hooks'

/**
 * 取消黑名单用户
 * @param uid 用户uid
 * @param cb 回调函数
 */
export const onBlockedUserRemove = (uid: string, cb?: () => void) => {
  const params = {
    uid,
  }
  blockedUserRemove(params)
    .then((res) => {
      toast(res.data.toast, { duration: 1500, type: 'success' }, cb)
    })
    .catch(() => {
      toast('操作失败')
    })
}

/**
 * 添加黑名单用户
 * @param uid 用户uid
 * @param cb 回调函数
 */
export const onBlockedUserCreate = (uid: string, cb?: () => void) => {
  const params = {
    uid,
  }
  blockedUserCreate(params)
    .then((res) => {
      toast(res.data.toast, { duration: 1500, type: 'success' }, cb)
    })
    .catch(() => {
      toast('操作失败', { type: 'warn' })
    })
}

export const BlockedModal: React.FC<modalType> = ({ open, onClose }) => {
  const [height] = useState<number>(useDisplayInfo().Height * 0.4)
  const [loading, setLoading] = useState<boolean>(false)
  const [profileModal, setProfileModal] = useState<{
    open: boolean
    uid: string
  }>({
    open: false,
    uid: '',
  })
  const [lists, setLists] = useState<
    {
      avatar: { picture: imageType }
      nickname: string
      uid: string
      gender?: genderType
      relation: 'STRANGE' | 'FOLLOWING'
    }[]
  >([])

  /**
   * 获取黑名单列表数据
   */
  const getLists = () => {
    setLoading(true)
    blockedUserLists()
      .then((res) => setLists(res.data.data))
      .catch(() => {
        toast('获取黑名单列表失败', { type: 'warn' })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (open) getLists()
  }, [open])

  return (
    <Modal
      title={`小黑屋${lists.length > 0 ? `(${lists.length})` : ''}`}
      open={open}
      onClose={onClose}
    >
      <Spinner loading={loading}>
        {lists.length > 0 ? (
          <div className="blocked-modal-wrapper">
            <ScrollArea
              type="hover"
              scrollbars="vertical"
              style={{ height }}
            >
              <Grid
                columns="2"
                mt="3"
                mr="4"
                gap="4"
                width="auto"
              >
                {lists.map(
                  (
                    item: {
                      avatar: { picture: imageType }
                      nickname: string
                      uid: string
                      gender?: genderType
                      relation: 'STRANGE' | 'FOLLOWING'
                    },
                    index: number,
                  ) => (
                    <Box
                      className="chunk"
                      mb="4"
                      key={index}
                    >
                      <Flex gap="1">
                        <Avatar
                          className="avatar"
                          src={item.avatar.picture.picUrl}
                          fallback={item.nickname}
                          onClick={() => {
                            setProfileModal({
                              open: true,
                              uid: item.uid,
                            })
                          }}
                        />
                        <Box>
                          <Text
                            className="nickname"
                            mb="1"
                            size="3"
                            title={item.nickname}
                          >
                            {item.nickname}
                          </Text>
                          <Text>
                            {item?.gender === 'MALE' ? (
                              <SlSymbolMale
                                fontSize="12"
                                color="royalblue"
                              />
                            ) : null}
                            {item?.gender === 'FEMALE' ? (
                              <SlSymbleFemale
                                fontSize="12"
                                color="pink"
                              />
                            ) : null}
                          </Text>
                        </Box>
                        <Box>
                          <Button
                            variant="soft"
                            color="gray"
                            size="1"
                            onClick={() => {
                              onBlockedUserRemove(item.uid, getLists)
                            }}
                          >
                            解除
                          </Button>
                        </Box>
                      </Flex>
                    </Box>
                  ),
                )}
              </Grid>
            </ScrollArea>
          </div>
        ) : (
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
      </Spinner>
    </Modal>
  )
}
