import { makeAutoObservable } from 'mobx'
import { userType } from '@/types/user'
import { initMusic } from "@/utils/musicPlay"

class UserStore {
  user: userType = {
    uid: '',
  }

  musicInfo: any = {}

  constructor() {
    makeAutoObservable(this)
  }

  init(data: userType) {
    this.user = data
  }
  initSetMusic() {
    const init = initMusic()
    this.musicInfo = init
  }
}

export default new UserStore()
