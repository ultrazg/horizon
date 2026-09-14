import React from 'react'
import styles from './index.module.scss'

export const BlockedUserTag = () => {
  return (
    <span className={styles['blocked-user-tag']}>已将该用户加入黑名单</span>
  )
}
