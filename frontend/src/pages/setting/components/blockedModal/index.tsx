import React from 'react'
import { Modal } from '@/components'
import './index.modules.scss'
import { modalType } from '@/types/modal'
import { Button, Dialog, Flex } from '@radix-ui/themes'
import { blockedUserLists } from '@/api/blocked'

export const BlockedModal: React.FC<modalType> = ({ open, onClose }) => {
  /**
   * 获取黑名单列表数据
   */
  const getLists = () => {
    //
  }

  return (
    <Modal
      title="黑名单"
      open={open}
      onClose={onClose}
    >
      <div className="blocked-modal-wrapper">blocked modal</div>

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
    </Modal>
  )
}
