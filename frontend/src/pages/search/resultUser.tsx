import React from 'react'
import styles from './result.module.scss'
import { useLocation } from 'react-router-dom'

/**
 * 用户搜索结果页
 * @constructor
 */
export const ResultUser: React.FC = () => {
  const { keyword } = useLocation().state

  return (
    <>
      <h3 className={styles['title']}>搜索用户“{keyword}”</h3>

      <div className={styles['search-result-wrapper']}>
        {Array.from({ length: 3 }).map(() => (
          <div className={styles['search-result-item']}>item</div>
        ))}
      </div>
    </>
  )
}
