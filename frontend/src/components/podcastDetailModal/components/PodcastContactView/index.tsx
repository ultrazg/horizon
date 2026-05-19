import React from 'react'
import { ContactType } from '@/types/contacts'
import styles from './index.module.scss'
import { CONSTANT } from '@/types/constant'
import { DialogType, ShowMessageDialog } from '@/utils'
import { BrowserOpenURL } from 'wailsjs/runtime'

type IProps = {
  contacts: ContactType[]
  color: string
}

function onLinkClick(url: string): void {
  ShowMessageDialog(
    DialogType.QUESTION,
    '跳转提示',
    `是否在浏览器中打开链接？\r\n${url}`,
  ).then((res) => {
    if (res === 'Yes' || res === '是') {
      BrowserOpenURL(url)
    }
  })
}

const PodcastContactView: React.FC<IProps> = ({ contacts, color }) => {
  return (
    <div className={styles['podcast-contact-view']}>
      <div
        className={styles['part-title']}
        style={{
          color,
        }}
      >
        联系方式
      </div>

      {contacts.map((item) => {
        switch (item.type) {
          case CONSTANT.CONTACTS_WECHAT:
            return (
              <p
                key={item.type}
                className={styles['contacts-item']}
              >
                <span
                  style={{
                    color,
                  }}
                >
                  {item.note || '添加微信'}：
                </span>
                <span>{item.name}</span>
              </p>
            )

          case CONSTANT.CONTACTS_WECHAT_OFFICIAL_ACCOUNTS:
            return (
              <p
                key={item.type}
                className={styles['contacts-item']}
              >
                <span
                  style={{
                    color,
                  }}
                >
                  {item.note}：
                </span>
                <span>{item.name}</span>
              </p>
            )

          case CONSTANT.CONTACTS_WEIBO:
            return (
              <p
                key={item.type}
                className={styles['contacts-item']}
              >
                <span
                  style={{
                    color,
                  }}
                >
                  微博：
                </span>
                <span
                  className={styles['link']}
                  onClick={() => onLinkClick(item?.url || '')}
                  style={{
                    color,
                  }}
                >
                  {item.name}
                </span>
              </p>
            )

          case CONSTANT.CONTACTS_JIKE:
            return (
              <p
                key={item.type}
                className={styles['contacts-item']}
              >
                <span
                  style={{
                    color,
                  }}
                >
                  即刻：
                </span>
                <span
                  className={styles['link']}
                  onClick={() => onLinkClick(item?.url || '')}
                  style={{
                    color,
                  }}
                >
                  {item.name}
                </span>
              </p>
            )

          case CONSTANT.CONTACTS_EMAIL:
            return (
              <p
                key={item.type}
                className={styles['contacts-item']}
              >
                <span
                  style={{
                    color,
                  }}
                >
                  {item.note || '邮箱'}：
                </span>
                <span>{item.name}</span>
              </p>
            )

          case CONSTANT.CONTACTS_CUSTOM:
            return (
              <p
                key={item.type}
                className={styles['contacts-item']}
              >
                <span
                  style={{
                    color,
                  }}
                >
                  链接：
                </span>
                <span
                  className={styles['link']}
                  onClick={() => onLinkClick(item?.url || '')}
                  style={{
                    color,
                  }}
                >
                  {item.name}
                </span>
              </p>
            )
        }
      })}
    </div>
  )
}

export default PodcastContactView
