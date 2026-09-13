import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'
import { toast, UpdateConfig, Log, ReadConfig } from '@/utils'
import { refreshToken } from '@/api/login'
import { USER_CONFIG_ENUM } from '@/types/config'

const httpRequest: AxiosInstance = axios.create({
  baseURL: '/',
  timeout: 15000,
})

/** 刷新 token 的接口地址 */
const REFRESH_TOKEN_URL = '/refresh_token'

let isRefreshing: boolean = false
let queue: Array<{
  resolve: (token: string) => void
  reject: (reason?: any) => void
}> = []

/**
 * 清空等待队列并全部拒绝
 * 只跳登录页而不处理队列的话，排队中的请求会永远挂起
 */
const rejectQueue = (reason?: any) => {
  queue.forEach((item) => item.reject(reason))
  queue = []
}

httpRequest.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  async (error: AxiosError) => {
    const { response } = error
    const statusCode = response?.status

    console.log('response', response)
    Log(
      `response status:${response?.status} url:${response?.request?.responseURL} data:${response?.config?.data}`,
    ).then()

    // 刷新 token 请求自身的 401 必须跳过，否则它也会走下面的逻辑排队等待刷新结果，形成死循环
    if (statusCode === 401 && error.config?.url !== REFRESH_TOKEN_URL) {
      try {
        if (!isRefreshing) {
          // 先置位再 await，避免并发请求同时触发多次刷新
          isRefreshing = true

          const XJikeAccessToken: string = await ReadConfig(
            USER_CONFIG_ENUM.accessToken,
          )
          const XJikeRefreshToken: string = await ReadConfig(
            USER_CONFIG_ENUM.refreshToken,
          )

          const params = {
            'x-jike-access-token': XJikeAccessToken,
            'x-jike-refresh-token': XJikeRefreshToken,
          }

          return refreshToken(params)
            .then(async (res) => {
              const XJikeAccessToken = res.data['x-jike-access-token']
              const XJikeRefreshToken = res.data['x-jike-refresh-token']

              if (!XJikeAccessToken || !XJikeRefreshToken) {
                throw new Error('刷新 token 响应缺少 token 字段')
              }

              await UpdateConfig(USER_CONFIG_ENUM.accessToken, XJikeAccessToken)
              await UpdateConfig(
                USER_CONFIG_ENUM.refreshToken,
                XJikeRefreshToken,
              )

              // 唤醒队列中等待的请求，用新 token 重试
              queue.forEach((item) => item.resolve(XJikeAccessToken))
              queue = []

              if (response) {
                response.headers['x-jike-access-token'] = XJikeAccessToken
                return httpRequest(response.config)
              }
            })
            .catch((err) => {
              console.error(err)
              Log(`refresh token 发生异常：${err}`).then()
              rejectQueue(err)
              window.location.href = '/#/login'
              return Promise.reject(err)
            })
            .finally(() => {
              isRefreshing = false
            })
        } else {
          return new Promise((resolve, reject) => {
            queue.push({
              resolve: (token: string) => {
                if (response) {
                  response.headers['x-jike-access-token'] = token
                  resolve(httpRequest(response.config))
                }
              },
              reject,
            })
          })
        }
      } catch (err) {
        console.error(err)
        Log(`httpRequest.interceptors.response error ${err}`).then()
        isRefreshing = false
      }
    }

    if (statusCode && statusCode !== 401) {
      toast(
        `请求失败（${statusCode}）访问${response.config.url}时遇到问题：${response.statusText}`,
        {
          type: 'warn',
          duration: 5000,
        },
      )

      Log(
        `请求失败（${statusCode}）访问${response.config.url}时遇到问题：${response.statusText}`,
      ).then()
    }

    return Promise.reject(response ? response.data : error)
  },
)

httpRequest.interceptors.request.use(
  async (config: AxiosRequestConfig | any) => {
    const XJikeAccessToken: string = await ReadConfig(
      USER_CONFIG_ENUM.accessToken,
    )

    if (XJikeAccessToken == '') {
      window.location.href = '/#/login'
    }

    config.headers['x-jike-access-token'] = XJikeAccessToken

    return config
  },
  (err) => {
    console.error(err)
    Log(`httpRequest.interceptors.request error ${err}`).then()
    return Promise.reject(err)
  },
)

const TOKEN_REFRESH_INTERVAL = 10 * 60 * 1000

setInterval(async () => {
  if (isRefreshing) return
  isRefreshing = true

  try {
    const accessToken: string = await ReadConfig(USER_CONFIG_ENUM.accessToken)
    const refreshTokenVal: string = await ReadConfig(
      USER_CONFIG_ENUM.refreshToken,
    )

    if (!accessToken || !refreshTokenVal) return

    const res = await axios.post(
      '/refresh_token',
      {
        'x-jike-access-token': accessToken,
        'x-jike-refresh-token': refreshTokenVal,
      },
      {
        timeout: 15000,
        headers: { 'x-jike-access-token': accessToken },
      },
    )

    const newAccess = res.data?.data?.['x-jike-access-token']
    const newRefresh = res.data?.data?.['x-jike-refresh-token']

    if (!newAccess || !newRefresh) {
      Log('定时刷新 token：响应缺少 token 字段，跳过').then()
      return
    }

    await UpdateConfig(USER_CONFIG_ENUM.accessToken, newAccess)
    await UpdateConfig(USER_CONFIG_ENUM.refreshToken, newRefresh)

    queue.forEach((item) => item.resolve(newAccess))
    queue = []
  } catch (err) {
    console.error('定时刷新 token 失败:', err)
    Log(`定时刷新 token 失败：${err}`).then()
    rejectQueue(err)
  } finally {
    isRefreshing = false
  }
}, TOKEN_REFRESH_INTERVAL)

export default httpRequest
