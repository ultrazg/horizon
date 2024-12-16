import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Theme } from '@radix-ui/themes'
import { ToastProvider } from '@/layouts'
import '@radix-ui/themes/styles.css'
import '@radix-ui/themes/tokens/base.css'
import '@radix-ui/themes/tokens/colors/purple.css'
import './style.css'

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <Theme
      hasBackground={false}
      radius="medium"
      appearance="dark"
      accentColor="purple"
    >
      <ToastProvider>
        <App />
      </ToastProvider>
    </Theme>
  </React.StrictMode>,
)
