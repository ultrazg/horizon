import React from 'react'
import { Modal } from '@/components'
import { modalType } from '@/types/modal'
import { Button } from '@radix-ui/themes'
import { GearIcon } from '@radix-ui/react-icons'

export const ProxyModal: React.FC<modalType> = ({ open, onClose }) => {
  return (
    <Modal
      title="HTTP 代理"
      open={open}
      onClose={onClose}
      options={
        <Button variant="soft">
          <GearIcon />
          保存设置
        </Button>
      }
    >
      Proxy Modal
    </Modal>
  )
}
