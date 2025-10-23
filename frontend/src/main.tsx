import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import {
  ToastProvider,
  EpisodeDetailModalProvider,
  PlayerProvider,
  ThemeProvider,
} from '@/layouts'
import '@radix-ui/themes/styles.css'
import '@radix-ui/themes/tokens/base.css'
import '@radix-ui/themes/tokens/colors/purple.css'
import './style.css'

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <ToastProvider>
      <ThemeProvider>
        <PlayerProvider>
          <EpisodeDetailModalProvider>
            <App />
          </EpisodeDetailModalProvider>
        </PlayerProvider>
      </ThemeProvider>
    </ToastProvider>
  </React.StrictMode>,
)
