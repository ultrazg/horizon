import React from 'react'
import { Box, Button, Flex } from '@radix-ui/themes'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import './index.scss'
import { BrowserOpenURL, WindowReloadApp } from 'wailsjs/runtime'
import { Log } from '@/utils'

export const Crash: React.FC = () => {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    Log(
      `crash error status:${error.status} - error status text:${error.statusText}`,
    ).then()
    return (
      <div className="crashWrapper">
        <h3 className="crashTitle">⚠️ 出现异常</h3>
        <div className="crashMessage">
          <pre>Status: {error.status}</pre>
          <pre>Message: {error.statusText}</pre>
        </div>

        <CrashButton />
      </div>
    )
  } else if (error instanceof Error) {
    Log(
      `crash error message:${error.message} - error stack:${error.stack}`,
    ).then()
    return (
      <div className="crashWrapper">
        <h3 className="crashTitle">⚠️ 出现致命错误</h3>
        <div className="crashMessage">
          <pre>{error.message}</pre>
          <pre>{error.stack}</pre>
        </div>

        <CrashButton />
      </div>
    )
  } else {
    return (
      <div className="crashWrapper">
        <h3 className="crashTitle">⚠️ 出现未知错误</h3>

        <CrashButton />
      </div>
    )
  }
}

const CrashButton: React.FC = () => {
  return (
    <Flex gap="5">
      <Box>
        <Button
          variant="soft"
          onClick={() => {
            WindowReloadApp()
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.84998 7.49998C1.84998 4.66458 4.05979 1.84998 7.49998 1.84998C10.2783 1.84998 11.6515 3.9064 12.2367 5H10.5C10.2239 5 10 5.22386 10 5.5C10 5.77614 10.2239 6 10.5 6H13.5C13.7761 6 14 5.77614 14 5.5V2.5C14 2.22386 13.7761 2 13.5 2C13.2239 2 13 2.22386 13 2.5V4.31318C12.2955 3.07126 10.6659 0.849976 7.49998 0.849976C3.43716 0.849976 0.849976 4.18537 0.849976 7.49998C0.849976 10.8146 3.43716 14.15 7.49998 14.15C9.44382 14.15 11.0622 13.3808 12.2145 12.2084C12.8315 11.5806 13.3133 10.839 13.6418 10.0407C13.7469 9.78536 13.6251 9.49315 13.3698 9.38806C13.1144 9.28296 12.8222 9.40478 12.7171 9.66014C12.4363 10.3425 12.0251 10.9745 11.5013 11.5074C10.5295 12.4963 9.16504 13.15 7.49998 13.15C4.05979 13.15 1.84998 10.3354 1.84998 7.49998Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
          Reload APP
        </Button>
      </Box>
      <Box>
        <Button
          variant="soft"
          onClick={() => {
            BrowserOpenURL('https://github.com/ultrazg/horizon/issues')
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3L6.5 3C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
          Bug Report
        </Button>
      </Box>
    </Flex>
  )
}
