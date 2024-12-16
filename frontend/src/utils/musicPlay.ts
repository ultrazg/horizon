import { toast } from '@/utils'
import wunv from "@/assets/舞女.mp3"
import xiangyanghua from "@/assets/向阳花.mp3"

/** 播放器主要信息
 * 属性
 * @property {string} src 播放地址
 * duration 总时长 number
 * currentTime 当前播放位置 number
 * paused 是否暂停 boolean
 * volume 音量 number 0-1
 * muted 是否静音 boolean
 * autoplay 是否自动播放 boolean
 * loop 是否单曲循环播放 boolean 
 * preload 指定音频文件的预加载行为 string "auto" | "metadata" | "none"
 * controls 是否显示控制条 boolean
 * networkState 网络状态 number 0 | 1 | 2
 * ended 播放是否结束 boolean
 * error 播放错误信息 object
 * readyState 播放状态 number 0 | 1 | 2 | 3  
 * buffered 已缓冲的区域
 * pausedTime 暂停时间 number
 * pausedDuration 暂停时长 number
 * currentSrc 当前播放地址 string
 * playbackRate 播放速度 number
 * defaultPlaybackRate 默认播放速度 number 
 * 
 * 设置方法：
 * setVolume(volume: number) 设置音量
 * setMuted(muted: boolean) 设置静音
 * setLoop(loop: boolean) 设置循环播放
 * setAutoplay(autoplay: boolean) 设置自动播放
 * setPreload(preload: string) 设置预加载行为
 * setSrc(src: string) 设置播放地址
 * 
 * 事件：
 * play() 播放音频
 * pause() 暂停音频：音频会暂停在当前的播放位置，不会重置播放位置
 * stop() 停止音频：停止当前音频的播放，并将播放位置重置到开头
 * seek(time: number) 跳转到指定位置
 * load() 重新加载音频资源 
 * onplay() 音频开始播放时触发
 * onpause() 音频暂停时触发
 * onended() 音频播放结束
 * oncanplay() 音频可以播放时触发
 * onloadeddata() 音频加载完毕时触发
 * onprogress() 音频加载进度变化时触发
 * onerror() 播放错误时触发
 * 
 * */
export const initMusic = () => {
  let isPlay = false // 是否可播放
  let currentSongIndex = 0 // 当前播放索引
  let isListLoop = true // 播放列表是否循环播放
  let musicList = [wunv, xiangyanghua] // 播放列表
  let timer:any = null // 定时器
  let curProgress = 0 // 播放进度条

  const audio = new Audio()
  console.log("初始化加载", audio)
  // audio.src = file
  audio.controls = false
  audio.loop = false
  audio.autoplay = false
  audio.volume = 0.5

  audio.onloadedmetadata = () => {
    console.log("音源信息：", {
      duration: audio.duration,
      currentTime: audio.currentTime,
      paused: audio.paused,
      volume: audio.volume,
      muted: audio.muted,
      audio
    });
  };
  audio.oncanplay = (e) => {
    isPlay = true
    console.log("音频可以播放时触发canplay", e,audio.currentTime);
  }
  audio.onplay = () => {
    console.log("音频开始播放=",audio.currentTime);
  }
  audio.onpause = (e) => {
    console.log("音频暂停=", audio.currentTime, e);
    clearInterval(timer)
  }
  audio.onended = () => {
    console.log("当前音频播放结束", isListLoop)
    clearInterval(timer)
    if (isListLoop) {
      playNextSong()
    }
  };
  audio.onerror = (e) => {
    toast("学艺不精请稍后...")
    console.error("音频加载或播放错误：", e)
  };
  
  // 实时获取当前播放进度
  const getCurPlayPosition = () => {
    timer = setInterval(() => {
      if (audio.currentTime >= audio.duration) {
        clearInterval(timer)
      }
      curProgress = Number((audio.duration / audio.currentTime).toFixed(0))
    }, 1000)
  }

  const playSong = () => {
    if (musicList.length <= 0) {
      toast('歌曲加载失败...')
      return console.error("播放列表为空",musicList)
    }
    
    console.log(audio.src,currentSongIndex, "开始播放", audio.currentTime);
    if(!audio.src) {
      audio.src = musicList[currentSongIndex];
    }
    audio.play();
  }
  const pauseSong = () => {
    audio.pause();
    console.log("点击暂停", audio.currentTime);
  };
  // 播放下一首
  const playNextSong = () => {
    if (currentSongIndex < musicList.length - 1) {
      currentSongIndex++;
    } else {
      currentSongIndex = 0;
    }
    audio.src = musicList[currentSongIndex];
    audio.play();
  }
  // 播放上一首
  const playPreviousSong = () => {
    if (currentSongIndex > 0) {
      currentSongIndex--;
    } else {
      currentSongIndex = musicList.length - 1;
    }
    audio.src = musicList[currentSongIndex];
    audio.play();
  }

  // 设置播放列表
  const setPlayList = (list: any[]) => {
    musicList = list.length > 0 ? list : []
  }
  // 设置播放进度
  const setProgres = (time: number) => {

    console.log(time,"设置播放进度11=",audio.duration / 100 * time)
    if(time === 100) return playNextSong();
    if(time === 0) {
      audio.currentTime = 0;
      return 
    };
    audio.currentTime = audio.duration / 100 * time;
    // audio.play();
    // audio.currentTime = 66;
  }
  // 插入播放列表，优先播放
  const setSrc = (src: string) => {
    musicList = musicList.splice(currentSongIndex, 0, src)
    audio.src = src
    audio.play();
  }

  return {
    audio,
    curProgress,
    play: playSong,
    playNext: playNextSong,
    playPre: playPreviousSong,
    pause: pauseSong,
    stop: () => {
      audio.pause();
      audio.currentTime = 0;
    },
    seek: setProgres,
    load: () => {
      console.log("重新加载音乐",audio)
      audio.load()
    },
    setSrc: setSrc,
    setVolume: (volume: number) => audio.volume = volume,
    setMuted: (muted: boolean) => audio.muted = muted,
    setLoop: (loop: boolean) => audio.loop = loop,
    setPlayList
  }
}