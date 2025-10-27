import React, { createContext, useContext, useEffect, useState } from 'react'
import { Theme } from '@radix-ui/themes'
import {
  ReadConfig,
  GetSystemTheme,
  WindowSetLightTheme,
  WindowSetDarkTheme,
} from '@/utils'
import { SETTING_CONFIG_ENUM, settingConfigType } from '@/types/config'

export type ThemeMode = 'light' | 'dark'

interface ThemeContextValue {
  mode: ThemeMode
  toggle: (theme: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  toggle: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>('light')

  const toggle = (theme: ThemeMode) => setMode(() => theme)

  const initTheme = async () => {
    const theme: settingConfigType['theme'] = await ReadConfig(
      SETTING_CONFIG_ENUM.theme,
    )

    if (theme === 'system') {
      const systemTheme = await GetSystemTheme()

      setMode(() => (systemTheme === 'dark' ? 'dark' : 'light'))

      if (systemTheme === 'light') {
        WindowSetLightTheme()
      }

      if (systemTheme === 'dark') {
        WindowSetDarkTheme()
      }
    } else {
      setMode(() => theme)

      if (theme === 'light') {
        WindowSetLightTheme()
      }

      if (theme === 'dark') {
        WindowSetDarkTheme()
      }
    }
  }

  useEffect(() => {
    initTheme().catch(() => {
      setMode(() => 'light')
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      <Theme
        hasBackground={false}
        radius="medium"
        accentColor="purple"
        appearance={mode}
      >
        {children}
      </Theme>
    </ThemeContext.Provider>
  )
}
