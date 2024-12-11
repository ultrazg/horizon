import React from 'react'

type myDropdownMenuType = {
  open: boolean
  onClose: (data?: any) => void
  children: React.ReactNode
  trigger: React.ReactNode
}

type myDropdownMenuItem = {
  onClick?: (data?: any) => void
  children: React.ReactNode
  danger?: boolean
}

export type { myDropdownMenuType, myDropdownMenuItem }
