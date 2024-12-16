import { useBack } from '@/hooks'
import { IconButton } from '@radix-ui/themes'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import './index.modules.scss'

export const NavBackButton = () => {
  const back = useBack()

  return (
    <div className="nav-back-button">
      <IconButton
        onClick={back}
        size="3"
        variant="ghost"
        mt="1"
        mb="2"
        radius="full"
        color="gray"
      >
        <ChevronLeftIcon />
      </IconButton>
    </div>
  )
}
