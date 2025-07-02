import React, { useEffect, useState } from 'react'
import {
  Quit,
  WindowMinimise,
  WindowToggleMaximise,
} from 'wailsjs/runtime/runtime'
import {
  Cross1Icon,
  MinusIcon,
  EnterFullScreenIcon,
  ExitFullScreenIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons'
import { Environment } from 'wailsjs/runtime'
import { envType } from '@/types/env'
import { APP_NAME, APP_VERSION } from '@/utils'
import styles from './index.module.scss'
import { NavLink } from 'react-router-dom'
import { Avatar, TextField } from '@radix-ui/themes'

export const TitleBar = () => {
  const [envInfo, setEnvInfo] = useState<envType>()
  const [isMaximised, setIsMaximised] = useState<boolean>(false)

  const toggleWindowMaximised = (): void => {
    WindowToggleMaximise()
    setIsMaximised(!isMaximised)
  }

  useEffect(() => {
    Environment().then((res: envType) => {
      setEnvInfo(res)
    })
  }, [])

  return (
    <div
      className={
        envInfo?.platform === 'darwin'
          ? styles['title-bar-mac-layout']
          : styles['title-bar-windows-layout']
      }
      style={
        {
          '--wails-draggable': 'drag',
        } as any
      }
    >
      {envInfo?.platform !== 'darwin' && (
        <>
          <div className={styles['title-bar-text']}>
            {APP_NAME} v{APP_VERSION}
          </div>
          <div
            className={styles['title-bar-button']}
            style={
              {
                '--wails-draggable': 'none',
              } as any
            }
          >
            <div
              onClick={() => {
                WindowMinimise()
              }}
              title="最小化"
            >
              <MinusIcon />
            </div>
            <div
              onClick={() => {
                toggleWindowMaximised()
              }}
              title={isMaximised ? '还原' : '最大化'}
            >
              {isMaximised ? <ExitFullScreenIcon /> : <EnterFullScreenIcon />}
            </div>
            <div
              onClick={() => {
                Quit()
              }}
              title="退出"
            >
              <Cross1Icon />
            </div>
          </div>
        </>
      )}

      <div
        className={styles['navbar-layout']}
        style={
          {
            '--wails-draggable': 'drag',
          } as any
        }
      >
        <div className={styles['left-part']}>
          <a className={styles['nav-button']}>
            <ArrowLeftIcon />
          </a>

          <a className={styles['nav-button']}>
            <ArrowRightIcon />
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
          </ul>
        </div>

        <div className={styles['right-part']}>
          <div className={styles['search-input']}>
            <TextField.Root
              // size="3"
              placeholder="输入关键字"
            >
              <TextField.Slot>
                <MagnifyingGlassIcon
                  height="16"
                  width="16"
                />
              </TextField.Slot>
            </TextField.Root>
          </div>
          <div className={styles['avatar']}>
            <Avatar
              radius="full"
              src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
              fallback="A"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
