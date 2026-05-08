import React, { useEffect, useState } from 'react'
import { Empty, Modal } from '@/components'
import { modalType } from '@/types/modal'
import {
  AspectRatio,
  Box,
  Flex,
  Grid,
  ScrollArea,
  Separator,
  Text,
  Spinner,
} from '@radix-ui/themes'
import { useWindowSize } from '@/hooks'
import { stickerType } from '@/types/sticker'
import './index.modules.scss'
import dayjs from 'dayjs'
import { sticker } from '@/api/sticker'

type IProps = {
  uid: string
  perspective: '我' | '他' | '她' | 'TA'
} & modalType

/**
 * 我的贴纸库弹窗
 */
export const StickerModal: React.FC<IProps> = ({
  open,
  onClose,
  uid,
  perspective,
}) => {
  const [height] = useState(useWindowSize().height * 0.6)
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
  const [stickerLists, setStickerLists] = useState<stickerType[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  async function fetchData(
    loadMoreKey?: { skip: number },
    isRecursive: boolean = false,
  ): Promise<void> {
    if (!isRecursive) {
      setLoading(true)
    }

    try {
      const res = await sticker({
        uid,
        loadMoreKey,
      })

      setStickerLists((prev) => [...prev, ...res.data.data])
      setTotal(res.data.total)

      if (res.data?.loadMoreKey) {
        await fetchData(res.data.loadMoreKey, true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      if (!isRecursive) {
        setLoading(false)
      }
    }
  }

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

  useEffect(() => {
    if (open) fetchData().then()

    return () => {
      setStickerLists([])
      setTotal(0)
    }
  }, [open])

  return (
    <Modal
      title={`${perspective}的贴纸库(${total})`}
      open={open}
      onClose={onClose}
    >
      {!loading && total === 0 && <Empty />}

      <Spinner loading={loading}>
        <ScrollArea
          type="hover"
          scrollbars="vertical"
          style={loading || total === 0 ? { display: 'none' } : { height }}
        >
          <Grid
            columns="4"
            mt="3"
            gap="3"
            width="auto"
            mr="2"
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
      </Spinner>

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
