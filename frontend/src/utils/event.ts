import { EventsOn } from 'wailsjs/runtime'
import Player from './player'
import { UpdateConfig } from 'wailsjs/go/bridge/App'
import { PLAY_ENUM } from '@/types/config'

export const SaveLastPlay = (player: Player): void => {
  const playInfo = player.playInfo

  EventsOn('SaveLastPlay', () => {
    UpdateConfig(PLAY_ENUM.LAST_PLAY_EID, playInfo.eid).then()
  })
}
