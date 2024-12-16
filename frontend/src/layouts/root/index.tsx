import React, { useEffect, useState } from 'react'
import {
  MagnifyingGlassIcon,
  GlobeIcon,
  CardStackIcon,
  StarIcon,
  GearIcon,
} from '@radix-ui/react-icons'
import { ScrollArea } from '@radix-ui/themes'
import { NavLink, Outlet } from 'react-router-dom'
import { PlayController, NavUser } from '@/components'
import { useNavigateTo } from '@/hooks'
import { ReadConfig, IsStartup } from '@/utils'
import { Launch } from '@/pages'
import './index.modules.scss'
// import { useEffect, useState } from 'react'
// import { envType } from '@/types/env'
// import { Environment } from 'wailsjs/runtime'

export const Root: React.FC = () => {
  // const [envInfo, setEnvInfo] = useState<envType>()
  const [loading, setLoading] = useState<boolean>(true)

  const goLogin = useNavigateTo('/login')
  const goHome = useNavigateTo('/')

  const onReadConfigFunc = () => {
    setTimeout(() => {
      ReadConfig()
        .then((res) => {
          if (res.user.accessToken) {
            return goHome()
          } else {
            return goLogin()
          }
        })
        .catch((err: any) => {
          console.error('error', err)
        })
        .finally(() => {
          setLoading(false)
        })
    }, 3000)
  }

  useEffect(() => {
    IsStartup().then((res) => {
      if (res) {
        onReadConfigFunc()
      } else {
        setLoading(false)
        goHome()
      }
    })
  }, [])

  return (
    <>
      {loading ? (
        <Launch />
      ) : (
        <>
          <div className="root-layout">
            <nav className="nav-layout">
              <NavUser />

              <ul>
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive, isPending }) =>
                      isPending ? 'pending' : isActive ? 'active' : ''
                    }
                  >
                    <span className="icon-box">
                      <GlobeIcon className="icon" />
                    </span>
                    发现
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="search"
                    className={({ isActive, isPending }) =>
                      isPending ? 'pending' : isActive ? 'active' : ''
                    }
                  >
                    <span className="icon-box">
                      <MagnifyingGlassIcon className="icon" />
                    </span>
                    搜索
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="subscription"
                    className={({ isActive, isPending }) =>
                      isPending ? 'pending' : isActive ? 'active' : ''
                    }
                  >
                    <span className="icon-box">
                      <CardStackIcon className="icon" />
                    </span>
                    订阅
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="favorites"
                    className={({ isActive, isPending }) =>
                      isPending ? 'pending' : isActive ? 'active' : ''
                    }
                  >
                    <span className="icon-box">
                      <StarIcon className="icon" />
                    </span>
                    收藏
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="setting"
                    className={({ isActive, isPending }) =>
                      isPending ? 'pending' : isActive ? 'active' : ''
                    }
                  >
                    <span className="icon-box">
                      <GearIcon className="icon" />
                    </span>
                    设置
                  </NavLink>
                </li>
              </ul>
            </nav>

            <div className="outlet-layout">
              <ScrollArea type="hover">
                <Outlet />
              </ScrollArea>
            </div>
          </div>

          <PlayController />
        </>
      )}
    </>
  )
}
