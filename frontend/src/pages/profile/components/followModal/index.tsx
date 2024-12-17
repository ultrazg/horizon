import React, { useEffect, useState } from 'react'
import { Modal, ProfileModal } from '@/components'
import { modalType } from '@/types/modal'
import {
  Avatar,
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  Text,
  ScrollArea,
  Spinner,
} from '@radix-ui/themes'
import { following, follower } from '@/api/follow'
import { relationUpdata } from '@/api/relation'
import { useDisplayInfo } from '@/hooks'
import './index.modules.scss'
import { imageType } from '@/types/image'
import { toast, ShowMessageDialog, DialogType } from '@/utils'
import { SlSymbleFemale, SlSymbolMale } from 'react-icons/sl'
import { genderType } from '@/types/user'

type IProps = {
  uid: string
  type: 'FOLLOWING' | 'FOLLOWER'
} & modalType

/**
 * 关注/取关用户
 * @param uid 用户的 uid
 * @param relation 关系
 * @param nickname 用户的昵称
 * @param cb 回调函数
 */
export const onRelationUpdate = (
  uid: string,
  relation: string,
  nickname?: string,
  cb?: () => void,
) => {
  const params = {
    uid,
    relation: relation === 'FOLLOWING' ? 'STRANGE' : 'FOLLOWING',
  }

  if (relation === 'FOLLOWING') {
    ShowMessageDialog(
      DialogType.QUESTION,
      '提示',
      `确定不再关注「${nickname}」吗？`,
    ).then((res) => {
      if (res === 'Yes' || res === '是') {
        relationUpdata(params)
          .then(() => {
            cb?.()
          })
          .catch(() => {
            toast('操作失败')
          })
      }
    })
  } else {
    relationUpdata(params)
      .then(() => {
        cb?.()
      })
      .catch(() => {
        toast('操作失败')
      })
  }
}

export const FollowModal: React.FC<IProps> = ({ uid, type, onClose, open }) => {
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
   * 获取关注列表
   */
  const getFollowingList = () => {
    setLoading(true)
    const params = {
      uid,
    }
    following(params)
      .then((res) => setLists(res.data.data))
      .catch(() => {
        toast('获取关注列表失败')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  /**
   * 获取粉丝列表
   */
  const getFollowerList = () => {
    setLoading(true)
    const params = {
      uid,
    }
    follower(params)
      .then((res) => setLists(res.data.data))
      .catch(() => {
        toast('获取粉丝列表失败')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (open) {
      if (type === 'FOLLOWING') {
        getFollowingList()
      }
      if (type === 'FOLLOWER') {
        getFollowerList()
      }
    }

    return () => {
      setLists([])
    }
  }, [open])

  return (
    <Modal
      title={`我的${type === 'FOLLOWING' ? '关注' : '粉丝'}${lists.length > 0 ? `(${lists.length})` : ''}`}
      open={open}
      onClose={onClose}
    >
      <Spinner loading={loading}>
        {lists.length > 0 ? (
          <div className="follow-modal">
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
                      <Flex gap="2">
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
                            onClick={() => {
                              setProfileModal({
                                open: true,
                                uid: item.uid,
                              })
                            }}
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
                              const callbackFunc =
                                type === 'FOLLOWING'
                                  ? getFollowingList
                                  : getFollowerList

                              onRelationUpdate(
                                item.uid,
                                item.relation,
                                item.nickname,
                                callbackFunc,
                              )
                            }}
                          >
                            {item.relation === 'FOLLOWING' ? '已关注' : '关注'}
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

      <Flex
        gap="3"
        mt="4"
        justify="end"
      >
        <Dialog.Close>
          <Button
            variant="soft"
            color="gray"
          >
            关闭
          </Button>
        </Dialog.Close>
      </Flex>

      <ProfileModal
        uid={profileModal.uid}
        open={profileModal.open}
        onClose={(refresh) => {
          setProfileModal({
            open: false,
            uid: '',
          })

          if (refresh) {
            if (type === 'FOLLOWING') {
              getFollowingList()
            }
            if (type === 'FOLLOWER') {
              getFollowerList()
            }
          }
        }}
      />
    </Modal>
  )
}
