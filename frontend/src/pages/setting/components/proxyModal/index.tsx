import React from 'react'
import { Modal } from '@/components'
import { modalType } from '@/types/modal'
import { Button, Dialog, Flex } from '@radix-ui/themes'

export const ProxyModal: React.FC<modalType> = ({ open, onClose }) => {
  return (
    <Modal
      title="HTTP 代理"
      open={open}
      onClose={onClose}
    >
      Proxy Modal
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
        <Button variant="soft">保存设置</Button>
      </Flex>
    </Modal>
  )
}
