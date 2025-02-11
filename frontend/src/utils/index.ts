import httpRequest from './request'
import { isValidPhoneNumber, isValidIp } from './regex'
import { APP_NAME, APP_VERSION } from './appInfo'
import { toast } from './toast'
import Storage from '@/utils/storage'
import { UpdateConfig, ReadConfig, IsStartup } from 'wailsjs/go/bridge/App'
import { ShowMessageDialog, DialogType } from './dialog'
import { showEpisodeDetailModal } from './showEpisodeDetailModal'
import { testConnect } from './proxy'
import Player from './player'
import { SavePlayerInfo } from './event'

export {
  httpRequest,
  isValidPhoneNumber,
  APP_NAME,
  APP_VERSION,
  toast,
  Storage,
  UpdateConfig,
  ReadConfig,
  IsStartup,
  ShowMessageDialog,
  DialogType,
  showEpisodeDetailModal,
  isValidIp,
  testConnect,
  Player,
  SavePlayerInfo,
}
