import React from 'react'
import { Modal } from '@/components'
import { modalType } from '@/types/modal'
import { perspectiveType } from '@/types/user'

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
  return (
    <Modal
      title={`${perspective}的订阅`}
      open={open}
      onClose={onClose}
    >
      {uid}
    </Modal>
  )
}
