import React, { useEffect, useState } from 'react'
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons'
import { Storage } from '@/utils'
import styles from './index.module.scss'
import { NavLink, useNavigate } from 'react-router-dom'
import { Avatar, TextField } from '@radix-ui/themes'
import { userType } from '@/types/user'
import { useBack, useForward } from '@/hooks'

export const TitleBar = () => {
  const back = useBack()
  const forward = useForward()
  const navigateTo = useNavigate()
  const [info, setInfo] = useState<userType>({
    uid: '',
  })

  const onSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigateTo('/search', {
        state: {
          keyword: e.currentTarget.value,
        },
      })
    }
  }

  useEffect(() => {
    const data: userType = Storage.get('user_info')

    setInfo(data)
  }, [])

  return (
    <div className={styles['title-bar-layout']}>
      <div className={styles['navbar-layout']}>
        <div className={styles['left-part']}>
          <a
            title="后退"
            className={styles['nav-button']}
            onClick={back}
          >
            <ChevronLeftIcon />
          </a>

          <a
            title="前进"
            className={styles['nav-button']}
            onClick={forward}
          >
            <ChevronRightIcon />
          </a>
        </div>

        <div className={styles['middle-part']}>
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive, isPending }) =>
                  isPending ? 'pending' : isActive ? styles['active'] : ''
                }
              >
                首页
              </NavLink>
            </li>
            <li>
              <NavLink
                to="subscription"
                className={({ isActive, isPending }) =>
                  isPending ? 'pending' : isActive ? styles['active'] : ''
                }
              >
                订阅
              </NavLink>
            </li>
            <li>
              <NavLink
                to="favorites"
                className={({ isActive, isPending }) =>
                  isPending ? 'pending' : isActive ? styles['active'] : ''
                }
              >
                收藏
              </NavLink>
            </li>
            <li>
              <NavLink
                to="setting"
                className={({ isActive, isPending }) =>
                  isPending ? 'pending' : isActive ? styles['active'] : ''
                }
              >
                设置
              </NavLink>
            </li>
          </ul>
        </div>

        <div className={styles['right-part']}>
          <div
            className={styles['search-input']}
            style={
              {
                '--wails-draggable': 'none',
              } as any
            }
          >
            <TextField.Root
              placeholder="搜索"
              onKeyDown={onSearch}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon
                  height="16"
                  width="16"
                />
              </TextField.Slot>
            </TextField.Root>
          </div>
          <div
            className={styles['avatar']}
            style={
              {
                '--wails-draggable': 'none',
              } as any
            }
          >
            <NavLink
              to="profile"
              className={({ isActive, isPending }) =>
                isPending ? 'pending' : isActive ? styles['active'] : ''
              }
            >
              <Avatar
                radius="full"
                src={info.avatar}
                title={info.nickname}
                fallback={info.nickname || 'avatar'}
              />
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}
