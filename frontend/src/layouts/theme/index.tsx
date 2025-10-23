import React, { createContext, useContext, useState } from 'react'
import { Theme } from '@radix-ui/themes'

type ThemeMode = 'light' | 'dark'

interface ThemeContextValue {
  mode: ThemeMode
  toggle: (theme: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  toggle: (theme) => {},
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>('light')

  const toggle = (theme: ThemeMode) => setMode(() => theme)

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
