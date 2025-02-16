import React, { useEffect, useState } from 'react'
import { Modal } from '@/components'
import { modalType } from '@/types/modal'
import { Box, Button, Flex, Switch, Text, TextField } from '@radix-ui/themes'
import { GearIcon, RocketIcon } from '@radix-ui/react-icons'
import {
  DialogType,
  isValidIp,
  ReadConfig,
  ShowMessageDialog,
  testConnect,
  toast,
  UpdateConfig,
} from '@/utils'
import { PROXY_CONFIG_ENUM } from '@/types/config'
import { CONSTANT } from '@/types/constant'

export const ProxyModal: React.FC<modalType> = ({ open, onClose }) => {
  const [ip, setIp] = useState<string>('')
  const [port, setPort] = useState<string>('')
  const [enabled, setEnabled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const getSavedIpAndPort = async (): Promise<string[]> => {
    const res = await ReadConfig()

    return [res.proxy.ip, res.proxy.port]
  }

  const onChange = (
    type: 'ip' | 'port',
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (type === 'ip') {
      setIp(event.target.value)
    } else if (type === 'port') {
      setPort(event.target.value)
    }
  }

  const onSwitchChange = async (checked: boolean) => {
    const [ip, port] = await getSavedIpAndPort()

    if (ip === '' || port === '') {
      toast('请先保存代理设置', { type: 'warn' })

      return
    }

    setEnabled(checked)
    UpdateConfig(PROXY_CONFIG_ENUM.ENABLED, checked).then(() => {
      if (checked) {
        toast('启用代理', { type: 'success' })
      } else {
        toast('禁用代理', { type: 'success' })
      }
    })
  }

  const onCheck = (): boolean => {
    if (ip === '' || port === '') {
      toast('IP 和端口不能为空', { type: 'warn' })

      return false
    }

    if (!isValidIp(ip)) {
      toast('IP 不合法', { type: 'warn' })

      return false
    }

    const p = Number(port)

    if (isNaN(p) || p < 0 || p > 65535) {
      toast('端口不合法', { type: 'warn' })

      return false
    }

    return true
  }

  useEffect(() => {
    if (open) {
      ReadConfig()
        .then((res) => {
          const { ip, port, enabled } = res.proxy

          setIp(ip)
          setPort(port)
          setEnabled(enabled)
        })
        .catch((err) => {
          console.error('err', err)
        })
    }
  }, [open])

  return (
    <Modal
      title="HTTP 代理"
      open={open}
      onClose={onClose}
      options={
        <>
          <Button
            disabled={ip === '' || port === '' || loading}
            variant="soft"
            loading={loading}
            onClick={() => {
              if (onCheck()) {
                setLoading(true)

                Promise.all([
                  testConnect(CONSTANT.GOOGLE_URL, ip, port),
                  testConnect(CONSTANT.GITHUB_URL, ip, port),
                ])
                  .then((res) => {
                    const [googleResponse, githubResponse] = res

                    ShowMessageDialog(
                      DialogType.INFO,
                      '测试结果',
                      `Google Status: ${googleResponse.code} ${googleResponse.code === 200 ? 'OK' : 'FAILED'}\r\nGithub Status: ${githubResponse.code} ${githubResponse.code === 200 ? 'OK' : 'FAILED'}`,
                    ).then()
                  })
                  .catch((err) => {
                    toast('错误', { type: 'warn' })
                  })
                  .finally(() => {
                    setLoading(false)
                  })
              }
            }}
          >
            <RocketIcon />
            测试连接
          </Button>

          <Button
            variant="soft"
            onClick={() => {
              if (onCheck()) {
                Promise.all([
                  UpdateConfig(PROXY_CONFIG_ENUM.IP, ip),
                  UpdateConfig(PROXY_CONFIG_ENUM.PORT, port),
                ])
                  .then(() => {
                    toast('保存成功', { type: 'success' })
                  })
                  .catch(() => {
                    toast('保存失败', { type: 'warn' })
                  })
              }
            }}
          >
            <GearIcon />
            保存设置
          </Button>
        </>
      }
    >
      <Flex gap="3">
        <Box width="100px">
          <Text color="gray">启用代理</Text>
        </Box>
        <Box width="220px">
          <Switch
            checked={enabled}
            onCheckedChange={onSwitchChange}
          />
          <Text
            as="span"
            color="gray"
            size="1"
            mt="1"
            style={{ fontWeight: 300, marginLeft: '12px' }}
          >
            启用前建议先测试连接
          </Text>
        </Box>
      </Flex>

      <Flex
        gap="3"
        mt="4"
        mb="4"
      >
        <Box width="100px">
          <Text color="gray">代理地址</Text>
        </Box>
        <Box width="100px">
          <TextField.Root
            value={ip}
            onChange={(event) => onChange('ip', event)}
          />
        </Box>
      </Flex>

      <Flex gap="3">
        <Box width="100px">
          <Text color="gray">代理端口</Text>
        </Box>
        <Box width="100px">
          <TextField.Root
            value={port}
            onChange={(event) => onChange('port', event)}
          />
        </Box>
      </Flex>
    </Modal>
  )
}
