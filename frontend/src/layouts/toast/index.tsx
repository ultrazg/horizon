import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { setToastFunction } from '@/utils/toast'
import './index.modules.scss'

export type ToastOptions = {
  duration?: number
}

type ToastContextType = {
  addToast: (message: string, options?: ToastOptions) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

/** react hook */
export const useToast = () => useContext(ToastContext)

/** Toast component */
export const ToastProvider = ({ children }: { children: any }) => {
  const [toasts, setToasts] = useState<any>([])

  const addToast = useCallback(
    (message: string, options?: ToastOptions, cb?: () => void) => {
      const id = Date.now() // 唯一 ID
      const newToast = { id, message, ...options }

      setToasts((prevToasts: any) => [...prevToasts, newToast])

      if (!options?.duration || options?.duration > 0) {
        setTimeout(() => {
          const toastElement = document.getElementById(`toast-${id}`)
          if (toastElement) {
            toastElement.classList.remove('show')
          }

          cb && cb()

          setTimeout(() => {
            setToasts((prevToasts: any) =>
              prevToasts.filter((toast: any) => toast.id !== id),
            )
          }, 300)
        }, options?.duration || 3000)
      }
    },
    [],
  )

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts: any) =>
      prevToasts.filter((toast: any) => toast.id !== id),
    )
  }, [])

  useEffect(() => {
    setToastFunction(addToast)
  }, [addToast])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast: any) => (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className="toast show"
          >
            {toast.message}
            <button onClick={() => removeToast(toast.id)}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
