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

let isRefreshing: boolean = false
let queue: Array<any> = []

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

    if (statusCode === 401) {
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

      try {
        if (!isRefreshing) {
          isRefreshing = true

          return refreshToken(params)
            .then((res) => {
              const XJikeAccessToken = res.data['x-jike-access-token']
              const XJikeRefreshToken = res.data['x-jike-refresh-token']

              UpdateConfig(
                USER_CONFIG_ENUM.accessToken,
                XJikeAccessToken,
              ).then()
              UpdateConfig(
                USER_CONFIG_ENUM.refreshToken,
                XJikeRefreshToken,
              ).then()

              if (response) {
                response.headers['x-jike-access-token'] = XJikeAccessToken

                queue.forEach((cb) => {
                  cb(response)
                })
                queue = []

                return httpRequest(response.config)
              }
            })
            .catch((err) => {
              console.error(err)
              Log(`refresh token 发生异常：${err}`).then()
              window.location.href = '/#/login'
              return Promise.reject(err)
            })
            .finally(() => {
              isRefreshing = false
            })
        } else {
          return new Promise((resolve) => {
            if (response) {
              queue.push((token: string) => {
                response.headers['x-jike-access-token'] = token
                resolve(httpRequest(response.config))
              })
            }
          })
        }
      } catch (err) {
        console.error(err)
        Log(`httpRequest.interceptors.response error ${err}`).then()
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

    if (response) {
      return Promise.reject(response.data)
    }
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

export default httpRequest
