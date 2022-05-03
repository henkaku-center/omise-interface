import { ChangeEventHandler, useCallback, useState } from 'react'
import { useKamonNFT } from '@/hooks/useKamonNFT'
import { useToast } from '@/hooks/useToast'

export const useKeywordSubmit = () => {
  const { contract } = useKamonNFT()
  const { toast } = useToast()

  const [keyword, setKeyword] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const inputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setKeyword(event.target.value)
  }

  const getErrorMessageFromRaw = (message: string): string => {
    const regexp =
      /Error: VM Exception while processing transaction: reverted with reason string '([a-zA-Z :]+)'/
    const result = regexp.exec(message)
    return result && result.length > 1 ? result[1] : ''
  }

  const handleErrorMessage = useCallback((raw: string): string => {
    const message = getErrorMessageFromRaw(raw)
    switch (message) {
      case 'MUST BE HOLDER':
        return 'Only token holders may answer.'
      case 'WRONG ANSWER':
        return 'Your answer is wrong.'
      case 'ALREADY ANSWERED':
        return "You have already answered this week's question."
      default:
        return 'Unknown Server Error'
    }
  }, [])

  const submit = useCallback(async () => {
    setIsLoading(true)
    await contract
      .checkAnswer(keyword)
      .then(() =>
        toast({
          title: 'Submitted',
          description: 'Answer was correct.\nYou earn $100 henkaku',
          status: 'success'
        })
      )
      .catch((e) => {
        toast({
          title: 'Error',
          description: handleErrorMessage(e.data.message),
          status: 'error'
        })
      })
      .finally(() => setIsLoading(false))
  }, [contract, handleErrorMessage, keyword, toast])

  return { keyword, inputChange, submit, isLoading }
}
