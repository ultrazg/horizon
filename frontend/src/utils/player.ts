import { toast, Log } from '@/utils'

export type PlayerEpisodeInfoType = {
  title: string
  pid: string
  eid: string
  cover: string
  liked: boolean
}

export type PlayInfoType = {
  duration: number
  current: number
} & PlayerEpisodeInfoType

class Player {
  private audio: HTMLAudioElement
  public isLoading: boolean = false
  public episodeInfo: PlayerEpisodeInfoType = {
    title: '',
    pid: '',
    eid: '',
    cover: '',
    liked: false,
  }

  constructor() {
    this.audio = new Audio()
    this.audio.preload = 'auto'
    this.audio.oncanplaythrough = () => {
      this.isLoading = false

      console.log('horizon player - 可以播放')
      Log('horizon player - 可以播放').then()
    }
    this.audio.onplay = () => {
      console.log('horizon player - 开始播放')
    }
    this.audio.onpause = () => {
      console.log('horizon player - 暂停播放')
    }
    this.audio.onerror = (e) => {
      toast(`加载或播放发生错误 ${e}`, { type: 'warn' })
      console.error(`horizon player - 加载或播放错误：${e}`)
      Log(`horizon player - 加载或播放错误：${e}`).then()
    }
    this.audio.onloadstart = () => {
      this.isLoading = true

      console.log('horizon player - 开始加载')
      Log('horizon player - 开始加载').then()
    }
  }

  /**
   * 加载远程音频地址
   * @param url 远程音频地址
   * @param episodeInfo 单集信息
   */
  load(url: string, episodeInfo: PlayerEpisodeInfoType): void {
    this.isLoading = true
    this.audio.src = url
    this.episodeInfo = episodeInfo
    this.audio.load()

    console.log(`horizon player - 已加载远程地址 ${url}`)
    Log(`horizon player - 已加载远程地址 ${url}`).then()
  }

  /**
   * 播放
   */
  play(): void {
    this.audio.play().catch((e) => {
      console.error(`horizon player - 播放失败 ${e}`)
      Log(`horizon player - 播放失败 ${e}`).then()
    })
  }

  /**
   * 暂停
   */
  pause(): void {
    this.audio.pause()
  }

  stop(): void {
    this.audio.pause()
    this.audio.currentTime = 0
    this.isLoading = false
    this.episodeInfo = {
      title: '',
      pid: '',
      eid: '',
      cover: '',
      liked: false,
    }
    this.audio.load()
  }

  /**
   * 切换播放状态
   */
  togglePlay(): void {
    if (this.audio.paused && this.audio.src) {
      this.play()
    } else {
      this.pause()
    }
  }

  /**
   * 设置播放进度
   * @param seconds 进度（秒）
   */
  seek(seconds: number): void {
    this.audio.currentTime = seconds
  }

  /**
   * 快进、快退
   * @param seconds 秒数（正数快进、负数快退）
   */
  skip(seconds: number): void {
    if (seconds < 0) {
      const second = Math.abs(seconds)

      if (second > this.audio.currentTime) {
        this.audio.currentTime = 0

        return
      }
    }

    this.audio.currentTime += seconds
  }

  /**
   * 设置播放速率
   * @param rate 播放速率
   */
  setPlaybackRate(rate: number): void {
    this.audio.playbackRate = rate
  }

  /**
   * 设置播放音量
   * @param volume 音量（0 ~ 1）
   */
  setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume))
  }

  /**
   * 更新播放信息
   * @param playInfo
   */
  updatePlayInfo(playInfo: PlayInfoType): void {
    this.episodeInfo = playInfo
  }

  /**
   * 获取是否正在播放
   */
  get isPlaying(): boolean {
    return !this.audio.paused
  }

  /**
   * 获取音频当前时间
   */
  get currentTime(): number {
    return this.audio.currentTime
  }

  /**
   * 获取音频总时长
   */
  get duration(): number {
    return this.audio.duration || 0
  }

  /**
   * 获取播放信息
   */
  get playInfo(): PlayInfoType {
    return {
      ...this.episodeInfo,
      duration: this.duration,
      current: this.currentTime,
    }
  }

  /**
   * 获取播放倍速
   */
  get playbackRate(): number {
    return this.audio.playbackRate
  }
}

export default Player
