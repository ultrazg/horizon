import React from 'react'

type modalType = {
  title?: string
  width?: string
  open: boolean
  onClose: (data?: any) => void
  onOk?: (data?: any) => void
  children?: React.ReactNode
}

export type { modalType }
