import styles from './index.module.scss'
import { APP_NAME } from '@/utils'
import { BrowserOpenURL } from 'wailsjs/runtime'
import { Text, Heading, Button, Flex, Separator } from '@radix-ui/themes'
import APP_ICON from '@/assets/images/logo.png'

export const About = () => {
  return (
    <div className={styles['about-layout']}>
      <div className={styles['app-logo']}>
        <div className={styles['logo']}>
          <img
            alt="app_icon"
            src={APP_ICON}
          />
        </div>
      </div>

      <div className={styles['app-info']}>
        <Heading
          size={'8'}
          mb={'3'}
        >
          {APP_NAME}
        </Heading>
        <Text mb={'3'}>
          {APP_NAME} 是一个第三方小宇宙桌面客户端，支持 Windows 与 macOS
        </Text>
        <Text mb={'9'}>
          接口服务：
          <Button
            ml={'1'}
            variant={'ghost'}
            onClick={() => {
              BrowserOpenURL('https://github.com/ultrazg/xyz')
            }}
          >
            xyz
          </Button>
        </Text>

        <Flex
          gap="3"
          align="center"
        >
          <Button
            variant="ghost"
            onClick={() => {
              BrowserOpenURL('https://github.com/ultrazg/horizon')
            }}
          >
            Source Code (GitHub)
          </Button>
          <Separator orientation="vertical" />
          <Button
            variant="ghost"
            onClick={() => {
              BrowserOpenURL('https://opensource.org/license/gpl-3-0')
            }}
          >
            GPL-3.0 License
          </Button>
          <Separator orientation="vertical" />
          <Button
            variant="ghost"
            onClick={() => {
              BrowserOpenURL('https://github.com/ultrazg/horizon/issues')
            }}
          >
            Bug report & Issue
          </Button>
        </Flex>
      </div>
    </div>
  )
}
