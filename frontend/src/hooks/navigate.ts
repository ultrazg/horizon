import { useNavigate } from 'react-router-dom'

export const useNavigateTo = (path: string) => {
  const navigate = useNavigate()

  return () => {
    navigate(path)
  }
}

export const useBack = () => {
  const navigate = useNavigate()

  return () => {
    navigate(-1)
  }
}

export const useForward = () => {
  return () => {
    window.history.forward()
  }
}
