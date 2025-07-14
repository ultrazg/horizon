import { useNavigateTo } from '@/hooks'
import { Storage } from '@/utils'
import styles from './index.module.scss'
import { useEffect, useState } from 'react'
import { userType } from '@/types/user'

export const NavUser = () => {
  const [info, setInfo] = useState<userType>({
    uid: '',
  })
  const goProfile = useNavigateTo('/profile')

  useEffect(() => {
    const data: userType = Storage.get('user_info')

    setInfo(data)
  }, [])

  return (
    <div
      className={styles['nav-user-layout']}
      onClick={() => {
        goProfile()
      }}
    >
      <div className={styles['left']}>
        <div className={styles['avatar-box']}>
          <img
            src={info.avatar}
            alt="avatar"
          />
        </div>
      </div>
      <div className={styles['right']}>
        <div className={styles['user-box']}>
          <p className={styles['nickname']}>{info.nickname}</p>
        </div>
      </div>
    </div>
  )
}
