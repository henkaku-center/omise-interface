import { chainId, useNetwork } from 'wagmi'

type ErrorWithData = Error & {
  data: {
    code: number
    data: string
    message: string
  }
}

export const useGetError = () => {
  const { activeChain } = useNetwork()

  const getError = (error: Error): string => {
    let errorMessage = ''

    switch (activeChain?.id) {
      case chainId.polygon:
        const errorWithData = error as ErrorWithData
        errorMessage = errorWithData.data.message
        break
      case chainId.goerli && chainId.rinkeby:
        errorMessage = error.message
        break
    }

    const regexp = /execution reverted: ([a-zA-Z :]+)/
    const result = regexp.exec(errorMessage)
    return result && result.length > 1 ? result[1] : ''
  }

  return { getError }
}
