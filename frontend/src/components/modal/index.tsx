import React from 'react'
import { Button, Dialog, Flex } from '@radix-ui/themes'
import { MinusCircledIcon } from '@radix-ui/react-icons'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { modalType } from '@/types/modal'

/**
 * @description 模态框
 * @param title 标题
 * @param open 是否打开
 * @param onClose 关闭回调
 * @param children 子元素
 * @param width 宽度
 * @param options 附加操作
 * @param hiddenCloseBtn 是否显示关闭按钮
 * @constructor
 */
export const Modal: React.FC<modalType> = ({
  title,
  open,
  onClose,
  children,
  width,
  options,
  hiddenCloseBtn = false,
}) => {
  // https://github.com/radix-ui/primitives/discussions/1997
  const avoidDefaultDomBehavior = (e: Event) => {
    e.preventDefault()
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onClose}
    >
      <Dialog.Content
        onPointerDownOutside={avoidDefaultDomBehavior}
        onInteractOutside={avoidDefaultDomBehavior}
        maxWidth={width}
      >
        {title ? (
          <Dialog.Title
            style={
              {
                '--wails-draggable': 'drag',
                userSelect: 'none',
                cursor: 'default',
              } as any
            }
          >
            {title}
          </Dialog.Title>
        ) : (
          <VisuallyHidden.Root>
            <Dialog.Title />
          </VisuallyHidden.Root>
        )}

        <VisuallyHidden.Root>
          <Dialog.Description />
        </VisuallyHidden.Root>

        {children}

        <Flex
          gap="3"
          mt="4"
          justify="end"
        >
          {options}

          {hiddenCloseBtn ? (
            <VisuallyHidden.Root>
              <Dialog.Close>
                <Button
                  variant="soft"
                  color="gray"
                >
                  <MinusCircledIcon />
                  关闭
                </Button>
              </Dialog.Close>
            </VisuallyHidden.Root>
          ) : (
            <Dialog.Close>
              <Button
                variant="soft"
                color="gray"
              >
                <MinusCircledIcon />
                关闭
              </Button>
            </Dialog.Close>
          )}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
