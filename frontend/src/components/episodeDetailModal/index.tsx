import React, { useState } from 'react'
import { Modal } from '@/components'
import { modalType } from '@/types/modal'
import { Button, Dialog, Flex } from '@radix-ui/themes'
import { useDisplayInfo } from '@/hooks'
import './index.moduless.scss'

/**
 * 单集详情弹窗
 * @param open    是否打开
 * @param onClose 关闭弹窗
 * @param width   宽度
 * @constructor
 */
export const EpisodeDetailModal: React.FC<modalType> = ({
  open,
  onClose,
  width,
}) => {
  const [height] = React.useState<number>(useDisplayInfo().Height)

  return (
    <Modal
      title="单集详情"
      open={open}
      onClose={onClose}
      width={width}
    >
      <div style={{ height: `${height * 0.6}px` }}>123</div>

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
