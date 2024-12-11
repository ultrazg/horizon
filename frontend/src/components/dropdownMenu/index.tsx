import React from 'react'
import { DropdownMenu } from '@radix-ui/themes'
import { myDropdownMenuType, myDropdownMenuItem } from '@/types/myDropdownMenu'

/**
 * 弹出式菜单
 * @param open 是否打开
 * @param onClose 关闭回调
 * @param children 菜单项
 * @param trigger 触发元素
 * @constructor
 */
export const MyDropdownMenu: React.FC<myDropdownMenuType> & {
  Item: React.FC<myDropdownMenuItem>
  Separator: typeof DropdownMenu.Separator
} = ({ open, onClose, children, trigger }) => {
  return (
    <DropdownMenu.Root
      open={open}
      onOpenChange={onClose}
    >
      <DropdownMenu.Trigger>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Content color="gray">{children}</DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

MyDropdownMenu.Item = ({ children, danger, onClick }) => (
  <DropdownMenu.Item
    onClick={onClick}
    color={danger ? 'red' : undefined}
  >
    {children}
  </DropdownMenu.Item>
)
MyDropdownMenu.Separator = DropdownMenu.Separator
