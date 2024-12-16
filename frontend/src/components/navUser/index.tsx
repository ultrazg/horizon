import { useNavigateTo } from '@/hooks'
import { Storage } from '@/utils'
import './index.modules.scss'
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
      className="nav-user-layout"
      onClick={() => {
        goProfile()
      }}
    >
      <div className="left">
        <div className="avatar-box">
          <img src={info.avatar} />
        </div>
      </div>
      <div className="right">
        <div className="user-box">
          <p className="nickname">{info.nickname}</p>
        </div>
      </div>
    </div>
  )
}
