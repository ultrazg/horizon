import { useDisplayInfoType } from '@/types/display'

export const useDisplayInfo = (): useDisplayInfoType => {
  const { innerHeight, innerWidth } = window

  return {
    Height: innerHeight,
    Width: innerWidth,
  }
}
