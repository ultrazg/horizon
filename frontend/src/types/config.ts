type settingConfigType = {
  theme: 'light' | 'dark' | 'system'
}

type userConfigType = {
  accessToken: string
  refreshToken: string
}

const SETTING_CONFIG_ENUM = {
  theme: 'setting.theme',
}

const USER_CONFIG_ENUM = {
  accessToken: 'user.access_token',
  refreshToken: 'user.refresh_token',
}

enum PROXY_CONFIG_ENUM {
  ENABLED = 'proxy.enabled',
  IP = 'proxy.ip',
  PORT = 'proxy.port',
}

enum PLAY_ENUM {
  LAST_PLAY_EID = 'play.last_play_eid',
}

export type { settingConfigType, userConfigType }
export { SETTING_CONFIG_ENUM, USER_CONFIG_ENUM, PROXY_CONFIG_ENUM, PLAY_ENUM }
