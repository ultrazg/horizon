import { useEffect, useState } from 'react'
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
} from '@radix-ui/react-icons'
import { Environment } from 'wailsjs/runtime'
import { envType } from '@/types/env'
import { APP_NAME, APP_VERSION } from '@/utils'
import styles from './index.module.scss'

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
      <div className={styles['navbar-layout']}>
        <div>left</div>
        <div>middle</div>
        <div>right</div>
      </div>
      {/*{envInfo?.platform !== 'darwin' && (*/}
      {/*  <>*/}
      {/*    <div className="title-bar-text">*/}
      {/*      {APP_NAME} v{APP_VERSION}*/}
      {/*    </div>*/}
      {/*    <div*/}
      {/*      className="title-bar-button"*/}
      {/*      style={*/}
      {/*        {*/}
      {/*          '--wails-draggable': 'none',*/}
      {/*        } as any*/}
      {/*      }*/}
      {/*    >*/}
      {/*      <div*/}
      {/*        onClick={() => {*/}
      {/*          WindowMinimise()*/}
      {/*        }}*/}
      {/*        title="最小化"*/}
      {/*      >*/}
      {/*        <MinusIcon />*/}
      {/*      </div>*/}
      {/*      <div*/}
      {/*        onClick={() => {*/}
      {/*          toggleWindowMaximised()*/}
      {/*        }}*/}
      {/*        title={isMaximised ? '还原' : '最大化'}*/}
      {/*      >*/}
      {/*        {isMaximised ? <ExitFullScreenIcon /> : <EnterFullScreenIcon />}*/}
      {/*      </div>*/}
      {/*      <div*/}
      {/*        onClick={() => {*/}
      {/*          Quit()*/}
      {/*        }}*/}
      {/*        title="退出"*/}
      {/*      >*/}
      {/*        <Cross1Icon />*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </>*/}
      {/*)}*/}
    </div>
  )
}
