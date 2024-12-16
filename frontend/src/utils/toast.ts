import { ToastOptions } from '@/layouts/toast'

let addToastFunction: any

export const setToastFunction = (
  func: (message: string, options?: ToastOptions, cb?: () => void) => void,
) => {
  addToastFunction = func
}

/**
 * 全局 toast 组件
 * @param message 消息内容
 * @param options 配置项
 * @param cb 回调函数
 * @example
 * import { toast } from '@/utils'
 * toast('Hello World')
 */
export const toast = (
  message: string,
  options?: ToastOptions,
  cb?: () => void,
) => {
  if (addToastFunction) {
    addToastFunction(message, options, cb)
  } else {
    console.warn('Toast function is not initialized.')
  }
}
