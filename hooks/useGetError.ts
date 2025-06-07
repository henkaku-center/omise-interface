import { useNetwork } from 'wagmi'
import { polygon, goerli } from 'wagmi/chains'

type ErrorWithData = Error & {
  data: {
    code: number
    data: string
    message: string
  }
}

export const useGetError = () => {
  const { chain } = useNetwork()

  const getError = (error: Error): string => {
    let errorMessage = ''

    switch (chain?.id) {
      case polygon.id:
        const errorWithData = error as ErrorWithData
        errorMessage = errorWithData.data.message
        break
      case goerli.id:
        errorMessage = error.message
        break
    }

    const regexp = /execution reverted: ([a-zA-Z :]+)/
    const result = regexp.exec(errorMessage)
    return result && result.length > 1 ? result[1] : ''
  }

  return { getError }
}
