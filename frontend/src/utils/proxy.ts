import { TestConnect } from 'wailsjs/go/bridge/App'

/**
 * 测试代理
 * @param url 要访问的地址
 * @param ip 本地代理 IP
 * @param port 本地代理端口
 */
export const testConnect = (url: string, ip: string, port: string) =>
  TestConnect(url, ip, port)
