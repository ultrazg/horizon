import { RouterProvider } from 'react-router-dom'
import { router } from './router/routes'
import { TitleBar } from './components'
import { useEffect } from 'react'
import { SavePlayerInfo } from '@/utils'
import { usePlayer } from '@/hooks'

function App() {
  const player = usePlayer()

  useEffect(() => {
    if (player.isPlaying) {
      SavePlayerInfo(player)
    }
  }, [player])

  return (
    <>
      <TitleBar />
      <RouterProvider router={router} />
    </>
  )
}

export default App
