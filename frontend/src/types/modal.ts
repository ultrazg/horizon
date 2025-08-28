import React from 'react'

type modalType = {
  title?: string | React.ReactNode
  width?: string
  open: boolean
  onClose: (refresh?: boolean) => void
  onOk?: (data?: any) => void
  children?: React.ReactNode
  options?: React.ReactNode
  hiddenCloseBtn?: boolean
}

export type { modalType }
