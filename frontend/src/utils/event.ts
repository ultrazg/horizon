import { EventsOn } from 'wailsjs/runtime'
import Player from './player'

export const SavePlayerInfo = (player: Player): void => {
  const playInfo = player.playInfo

  EventsOn('SavePlayerInfo', () => {
    console.log('MAYDAY', playInfo)
  })
}
