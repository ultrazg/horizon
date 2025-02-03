import React, { createContext, useContext, useState } from 'react'
import { Player } from '@/utils'

const PlayerContext = createContext<Player | null>(null)

export const usePlayer = () => {
  const player = useContext(PlayerContext)

  if (!player) {
    throw new Error('userPlayer 必须在 PlayerProvider 中使用')
  }

  return player
}

export const PlayerProvider = ({ children }: { children: any }) => {
  const [player] = useState<Player>(new Player())

  return (
    <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>
  )
}
