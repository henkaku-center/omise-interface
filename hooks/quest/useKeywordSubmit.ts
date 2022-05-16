import { ChangeEventHandler, useCallback, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { useContractWrite, useNetwork } from 'wagmi'
import kamonNFTContract from '@/utils/abis/kamonNFT.json'
import { getContractAddress } from '@/utils/contractAddress'
import { getErrorMessageFromRaw } from '@/utils/handleError'

export const useKeywordSubmit = () => {
  const { toast } = useToast()
  const { activeChain } = useNetwork()
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: activeChain?.id
  })
  const [keyword, setKeyword] = useState<string>('')
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
      },
      onSuccess() {
        toast({
          title: 'Submitted',
          description: 'Answer was correct.\nYou earn 100 points',
          status: 'success'
        })
      }
    }
  )

  const inputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setKeyword(event.target.value)
  }

  const handleErrorMessage = useCallback((error: Error): string => {
    switch (getErrorMessageFromRaw(error)) {
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

  return { keyword, inputChange, submit, isSubmitting }
}
