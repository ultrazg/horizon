import React from 'react'
import APP_ICON from '@/assets/images/logo.png'
import { APP_NAME, APP_VERSION } from '@/utils'
import { Spinner } from '@radix-ui/themes'
import './index.modules.scss'

/**
 * 启动界面
 * @constructor
 */
export const Launch = () => {
  return (
    <div className="launch-layout">
      <div className="launch-wrapper">
        <img
          src={APP_ICON}
          alt="logo"
        />
        <div>{APP_NAME}</div>
        <div>v{APP_VERSION}</div>
        <div>
          <Spinner size="3" />
        </div>
      </div>
    </div>
  )
}
