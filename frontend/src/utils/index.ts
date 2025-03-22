import httpRequest from './request'
import { isValidPhoneNumber, isValidIp } from './regex'
import { APP_NAME, APP_VERSION } from './appInfo'
import { toast } from './toast'
import Storage from '@/utils/storage'
import { UpdateConfig, ReadConfig } from 'wailsjs/go/bridge/App'
import { ShowMessageDialog, DialogType } from './dialog'
import { showEpisodeDetailModal } from './showEpisodeDetailModal'
import { testConnect } from './proxy'
import Player from './player'
import { SaveLastPlay } from './event'

export {
  httpRequest,
  isValidPhoneNumber,
  APP_NAME,
  APP_VERSION,
  toast,
  Storage,
  UpdateConfig,
  ReadConfig,
  ShowMessageDialog,
  DialogType,
  showEpisodeDetailModal,
  isValidIp,
  testConnect,
  Player,
  SaveLastPlay,
}
