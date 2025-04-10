import React, { useState } from 'react'
import { Modal } from '@/components'
import { modalType } from '@/types/modal'
import {
  AspectRatio,
  Box,
  Flex,
  Grid,
  ScrollArea,
  Separator,
  Text,
} from '@radix-ui/themes'
import { useDisplayInfo } from '@/hooks'
import { stickerType } from '@/types/sticker'
import './index.modules.scss'
import dayjs from 'dayjs'

type IProps = {
  perspective: '我' | '他' | '她' | 'TA'
  stickerLists: stickerType[]
} & modalType

/**
 * 我的贴纸库弹窗
 */
export const StickerModal: React.FC<IProps> = ({
  open,
  onClose,
  perspective,
  stickerLists,
}) => {
  const [height] = useState(useDisplayInfo().Height * 0.6)
  const [activeImg, setActiveImg] = useState<any>()
  const [transformStyle, setTransformStyle] = useState({})
  const [maskOpen, setMaskOpen] = useState<boolean>(false)
  const [currentActive, setCurrentActive] = useState<{
    name: string
    description: string
    issuer: string
    ownedAt: string
    number: string
  }>({
    name: '',
    description: '',
    issuer: '',
    ownedAt: '',
    number: '',
  })

  const handleClick = (event: any, index: number) => {
    const img = event.target
    const rect = img.getBoundingClientRect()
    const windowWidth: number = window.innerWidth
    const windowHeight: number = window.innerHeight

    const translateX: number = windowWidth / 2 - (rect.left + rect.width / 2)
    const translateY: number =
      windowHeight / 2 - (rect.top + rect.height / 2) - 50

    setTransformStyle({
      transform: `translate(${translateX}px, ${translateY}px) rotateY(360deg) scale(3)`,
      transition: 'transform 0.8s ease-out-in',
    })

    setActiveImg(index)
    setMaskOpen(true)
  }

  return (
    <Modal
      title={`${perspective}的贴纸库(${stickerLists.length})`}
      open={open}
      onClose={onClose}
    >
      <ScrollArea
        type="auto"
        scrollbars="vertical"
        style={{ height, paddingRight: 10 }}
      >
        <Grid
          columns="4"
          mt="3"
          gap="3"
          width="auto"
        >
          {stickerLists.map((sticker: stickerType, index: number) => (
            <Box
              width="100%"
              key={sticker.id}
              className="sticker-box"
            >
              <AspectRatio ratio={6 / 6}>
                <img
                  src={sticker.image.largePicUrl}
                  alt={sticker.name}
                  className={`sticker-image ${activeImg === index ? 'active' : ''}`}
                  onClick={(event) => {
                    if (!maskOpen) {
                      handleClick(event, index)
                      setCurrentActive({
                        name: sticker.name,
                        description: sticker.description,
                        issuer: sticker.issuer,
                        ownedAt: sticker.ownedAt,
                        number: sticker.number,
                      })
                    } else {
                      setMaskOpen(false)
                      setActiveImg(undefined)
                      setCurrentActive({
                        name: '',
                        description: '',
                        issuer: '',
                        ownedAt: '',
                        number: '',
                      })
                    }
                  }}
                  style={activeImg === index ? transformStyle : {}}
                />
              </AspectRatio>
              <Text className="sticker-name">{sticker.name}</Text>
            </Box>
          ))}
        </Grid>
      </ScrollArea>

      {maskOpen && (
        <div className="sticker-mask">
          <div className="sticker-info">
            <Text
              as="p"
              size="6"
              mb="1"
            >
              {currentActive.name}
            </Text>
            <Text
              as="p"
              className="secondary"
            >
              {currentActive.description}
            </Text>

            <div className="sticker-copy">
              <Flex
                mt="5"
                gap="3"
                align="center"
              >
                <Flex direction="column">
                  <Text size="3">{currentActive.issuer}</Text>
                  <Text
                    size="2"
                    className="secondary"
                  >
                    发行方
                  </Text>
                </Flex>
                <Separator
                  orientation="vertical"
                  size="2"
                />
                <Flex direction="column">
                  <Text size="3">
                    {dayjs(currentActive.ownedAt).format('YYYY.MM.DD')}
                  </Text>
                  <Text
                    size="2"
                    className="secondary"
                  >
                    收集日期
                  </Text>
                </Flex>
                <Separator
                  orientation="vertical"
                  size="2"
                />
                <Flex direction="column">
                  <Text size="3">{currentActive.number}</Text>
                  <Text
                    size="2"
                    className="secondary"
                  >
                    编号
                  </Text>
                </Flex>
              </Flex>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
