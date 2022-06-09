import { ChangeEventHandler, useCallback, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { useContractWrite, useNetwork } from 'wagmi'
import kamonNFTContract from '@/utils/abis/kamonNFT.json'
import { getContractAddress } from '@/utils/contractAddress'
import { useGetError } from '@/hooks/useGetError'

export const useKeywordSubmit = () => {
  const { toast } = useToast()
  const { activeChain } = useNetwork()
  const { getError } = useGetError()
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: activeChain?.id
  })
  const [keyword, setKeyword] = useState<string>('')
  const [keywordSubmitSucceeded, setKeywordSubmitSucceeded] = useState<boolean>()
  const { write: submit, isLoading: isSubmitting } = useContractWrite(
    {
      addressOrName: kamonNFT,
      contractInterface: kamonNFTContract.abi
    },
    'checkAnswer',
    {
      args: keyword.toUpperCase(),
      onError(error) {
        toast({
          title: 'Error',
          description: handleErrorMessage(error),
          status: 'error'
        })
        setKeywordSubmitSucceeded(false)
      },
      onSuccess() {
        toast({
          title: 'Submitted',
          description: 'Answer was correct.\nYou earn 100 points',
          status: 'success'
        })
        setKeywordSubmitSucceeded(true)
      }
    }
  )

  const inputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setKeyword(event.target.value)
  }

  const handleErrorMessage = useCallback((error: Error): string => {
    switch (getError(error)) {
      case 'MUST BE HOLDER':
        return 'Only token holders may answer.'
      case 'WRONG ANSWER':
        return 'Your answer is wrong.'
      case 'ALREADY ANSWERED':
        return "You have already answered this week's question."
      default:
        return 'Unknown Server Error'
    }
  }, [getError])

  return { keyword, inputChange, submit, isSubmitting, keywordSubmitSucceeded }
}
