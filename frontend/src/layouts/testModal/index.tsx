import { createContext, useCallback, useEffect, useState } from 'react'
import { Modal } from '@/components'
import { Button, Dialog, Flex } from '@radix-ui/themes'
import { setModalFunction } from '@/utils/modal'

type TestModalType = {
  showModal: (eid: string) => void
}

const ModalContext = createContext<TestModalType | undefined>(undefined)

export const TestModalPovider = ({ children }: { children: any }) => {
  const [open, setOpen] = useState<boolean>(false)

  const showModal = useCallback((eid: string) => {
    setOpen(true)
    console.log('eid', eid)
  }, [])

  useEffect(() => {
    setModalFunction(showModal)
  }, [showModal])

  return (
    <ModalContext.Provider value={{ showModal }}>
      {/* {children} */}

      <Modal
        title="Test Modal"
        open={open}
        onClose={() => setOpen(false)}
      >
        <div>Test Modal</div>

        <Flex
          gap="3"
          mt="4"
          justify="end"
        >
          <Dialog.Close>
            <Button
              variant="soft"
              color="gray"
            >
              关闭
            </Button>
          </Dialog.Close>
        </Flex>
      </Modal>

      {children}
    </ModalContext.Provider>
  )
}
