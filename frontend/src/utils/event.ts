import { UpdateConfig } from 'wailsjs/go/bridge/App'
import { PLAY_ENUM } from '@/types/config'

export const SaveLastPlay = (eid: string): void => {
  UpdateConfig(PLAY_ENUM.LAST_PLAY_EID, eid).then()
}
