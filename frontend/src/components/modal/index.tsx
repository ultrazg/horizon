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
 * @param backgroundImage 背景图片
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
  backgroundImage,
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
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'white',
        }}
      >
        {backgroundImage && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '50%',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(20px)',
                transform: 'scale(1.08)',
                opacity: 0.55,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '45%',
                left: 0,
                right: 0,
                height: '40%',
                background:
                  'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '60%',
                left: 0,
                right: 0,
                bottom: 0,
                background: 'white',
              }}
            />
          </div>
        )}

        <div style={backgroundImage ? { position: 'relative', zIndex: 1 } : {}}>
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
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
