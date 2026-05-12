import { RouterProvider } from 'react-router-dom'
import { router } from './router/routes'
import { useEffect, useState } from 'react'
import { SaveLastPlay } from '@/utils'
import { usePlayer } from '@/hooks'
import { StickerModal } from '@/components'
import { EventsOn } from '../wailsjs/runtime'
import { showStickerModalType } from '@/types/dialog'
import { perspectiveType } from '@/types/user'

function App() {
  const player = usePlayer()
  const [stickerModalOptions, setStickerModalOptions] = useState<{
    open: boolean
    uid: string
    perspective: perspectiveType
  }>({
    open: false,
    uid: '',
    perspective: '我',
  })

  useEffect(() => {
    const stickerModalFunc = EventsOn(
      'ShowStickerModal',
      (data: showStickerModalType) => {
        setStickerModalOptions({
          open: true,
          uid: data.uid,
          perspective: data.perspective,
        })
      },
    )

    return () => {
      stickerModalFunc()
    }
  }, [])

  useEffect(() => {
    SaveLastPlay(player)
  }, [player])

  return (
    <>
      <RouterProvider router={router} />

      <StickerModal
        uid={stickerModalOptions.uid}
        perspective={stickerModalOptions.perspective}
        open={stickerModalOptions.open}
        onClose={() => {
          setStickerModalOptions({
            uid: '',
            open: false,
            perspective: '我',
          })
        }}
      />
    </>
  )
}

export default App
