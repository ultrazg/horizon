import React, { useState } from 'react'
import { Modal } from '@/components'
import { modalType } from '@/types/modal'
import { Box, Button, Flex, Switch, Text, TextField } from '@radix-ui/themes'
import { GearIcon, RocketIcon } from '@radix-ui/react-icons'
import { DialogType, ShowMessageDialog } from '@/utils'

export const ProxyModal: React.FC<modalType> = ({ open, onClose }) => {
  const [ip, setIp] = useState<string>('')
  const [port, setPort] = useState<string>('')
  const [enable, setEnable] = useState<boolean>(false)
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
    setEnable(checked)
  }

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
              setLoading(true)

              setTimeout(() => {
                ShowMessageDialog(
                  DialogType.INFO,
                  '测试结果',
                  'Google：连接成功\r\nGithub：连接成功',
                ).then()
                setLoading(false)
              }, 3000)
            }}
          >
            <RocketIcon />
            连通性测试
          </Button>

          <Button
            variant="soft"
            onClick={() => {
              console.log(ip, port, enable)
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
            onChange={(event) => onChange('port', event)}
          />
        </Box>
      </Flex>

      <Flex gap="3">
        <Box width="100px">
          <Text color="gray">启用代理</Text>
        </Box>
        <Box width="220px">
          <Switch onCheckedChange={onSwitchChange} />
          <Text
            as="p"
            color="gray"
            size="1"
            mt="1"
          >
            启用前建议先进行连通性测试
          </Text>
        </Box>
      </Flex>
    </Modal>
  )
}
