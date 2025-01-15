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
  toast,
  UpdateConfig,
} from '@/utils'
import { PROXY_CONFIG_ENUM } from '@/types/config'
import { TestConnect } from 'wailsjs/go/bridge/App'

export const ProxyModal: React.FC<modalType> = ({ open, onClose }) => {
  const [ip, setIp] = useState<string>('')
  const [port, setPort] = useState<string>('')
  const [enabled, setEnabled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

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

  const onSwitchChange = (checked: boolean) => {
    setEnabled(checked)
  }

  const onCheck = (): boolean => {
    if (ip === '' || port === '') {
      toast('IP 和端口不能为空')

      return false
    }

    if (!isValidIp(ip)) {
      toast('IP 不合法')

      return false
    }

    const p = Number(port)

    if (isNaN(p) || p < 0 || p > 65535) {
      toast('端口不合法')

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

                TestConnect('https://www.github.com')
                  .then((res) => {
                    console.log(res)
                  })
                  .catch((err) => {
                    console.log(err)
                  })
                  .finally(() => {
                    setLoading(false)
                  })
              }
            }}
          >
            <RocketIcon />
            连通性测试
          </Button>

          <Button
            variant="soft"
            onClick={() => {
              if (onCheck()) {
                Promise.all([
                  UpdateConfig(PROXY_CONFIG_ENUM.IP, ip),
                  UpdateConfig(PROXY_CONFIG_ENUM.PORT, port),
                  UpdateConfig(PROXY_CONFIG_ENUM.ENABLED, enabled),
                ])
                  .then(() => {
                    toast('保存成功')
                  })
                  .catch(() => {
                    toast('保存失败')
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
          <Text color="gray">代理地址</Text>
        </Box>
        <Box width="100px">
          <TextField.Root
            placeholder="127.0.0.1"
            value={ip}
            onChange={(event) => onChange('ip', event)}
          />
        </Box>
      </Flex>

      <Flex
        gap="3"
        mt="4"
        mb="4"
      >
        <Box width="100px">
          <Text color="gray">代理端口</Text>
        </Box>
        <Box width="100px">
          <TextField.Root
            placeholder="7890"
            value={port}
            onChange={(event) => onChange('port', event)}
          />
        </Box>
      </Flex>

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
            as="p"
            color="gray"
            size="1"
            mt="1"
            style={{ fontWeight: 300 }}
          >
            启用前建议先进行连通性测试
          </Text>
        </Box>
      </Flex>
    </Modal>
  )
}
