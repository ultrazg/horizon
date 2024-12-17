import React from 'react'

type modalType = {
  title?: string
  width?: string
  open: boolean
  onClose: (refresh?: boolean) => void
  onOk?: (data?: any) => void
  children?: React.ReactNode
}

export type { modalType }
