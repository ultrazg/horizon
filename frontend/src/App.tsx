import { RouterProvider } from 'react-router-dom'
import { router } from './router/routes'
import { TitleBar } from './components'

function App() {
  return (
    <>
      <TitleBar />
      <RouterProvider router={router} />
    </>
  )
}

export default App
