import React from 'react'
import { Modal } from '@/components'
import { modalType } from '@/types/modal'
import { useWindowSize } from '@/hooks'

type IProps = {
  changelog: string
} & modalType

const ChangelogModal: React.FC<IProps> = ({ changelog, open, onClose }) => {
  const { height } = useWindowSize()

  return (
    <Modal
      title="版本历史"
      open={open}
      onClose={onClose}
    >
      <div style={{ maxHeight: `${height * 0.7}px`, overflowY: 'auto' }}>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {changelog}
        </pre>
      </div>
    </Modal>
  )
}

export default ChangelogModal
