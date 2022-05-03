import { useToast as useToastChakra, UseToastOptions } from '@chakra-ui/react'

export type toastOption = {
  title: string
  description: string
  status: 'info' | 'warning' | 'success' | 'error'
}

export const useToast = () => {
  const t = useToastChakra()
  const toastDuration = 5000

  const toast = (option: toastOption) => {
    t({
      title: option.title,
      description: option.description,
      status: option.status,
      duration: toastDuration,
      isClosable: true,
      position: 'top-right'
    })
  }
  return { toast }
}
