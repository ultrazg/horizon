import { Environment } from 'wailsjs/runtime'

export async function getEnv() {
  return await Environment()
}
