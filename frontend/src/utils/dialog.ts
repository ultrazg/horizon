import { MessageDialog } from 'wailsjs/go/bridge/App'

export enum DialogType {
  INFO = 'info',
  QUESTION = 'question',
  ERROR = 'error',
}

/**
 * 显示一个消息对话框
 * @param type Dialog 的类型
 * @param title Dialog 的标题
 * @param message Dialog 的内容
 * @example
 * ShowMessageDialog(
       DialogType.QUESTION,
       'title',
       'message',
     ).then((res) => {
       // type 为 DialogType.QUESTION 时，需要同时判断"Yes"和"是"
       if (res === 'Yes' || res === '是') {
         // ...
       }
     })
 * @returns
 */
export const ShowMessageDialog = (
  type: DialogType,
  title = 'horizon',
  message: string,
) => MessageDialog(type, title, message)
