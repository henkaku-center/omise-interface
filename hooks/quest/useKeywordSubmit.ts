import { ChangeEventHandler, useCallback, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { useContractWrite, useNetwork } from 'wagmi'
import kamonNFTContract from '@/utils/abis/kamonNFT.json'
import { getContractAddress } from '@/utils/contractAddress'
import { useGetError } from '@/hooks/useGetError'
import useTranslation from 'next-translate/useTranslation'

export const useKeywordSubmit = () => {
  const { toast } = useToast()
  const { t } = useTranslation('common')
  const { chain } = useNetwork()
  const { getError } = useGetError()
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: chain?.id
  })
  const [keyword, setKeyword] = useState<string>('')
  const [keywordSubmitSucceeded, setKeywordSubmitSucceeded] =
    useState<boolean>()
  const { write: submit, isLoading: isSubmitting } = useContractWrite({
    address: kamonNFT,
    abi: kamonNFTContract.abi,
    functionName: 'checkAnswer',
    args: [keyword.toUpperCase()],
    onError(error) {
      toast({
        title: t('QUEST.TOAST.keyword.error'),
        description: handleErrorMessage(error),
        status: 'error'
      })
      setKeywordSubmitSucceeded(false)
    },
    onSuccess() {
      toast({
        title: t('QUEST.TOAST.keyword.submitted'),
        description: t('QUEST.TOAST.keyword.correct'),
        status: 'success'
      })
      setKeywordSubmitSucceeded(true)
    }
  })

  const inputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setKeyword(event.target.value)
  }

  const handleErrorMessage = useCallback(
    (error: Error): string => {
      switch (getError(error)) {
        case 'MUST BE HOLDER':
          return t('QUEST.TOAST.keyword.mustBeHolder')
        case 'WRONG ANSWER':
          return t('QUEST.TOAST.keyword.wrongAnswer')
        case 'ALREADY ANSWERED':
          return t('QUEST.TOAST.keyword.alreadyAnswered')
        default:
          return t('QUEST.TOAST.keyword.defaultError')
      }
    },
    [getError, t]
  )

  return { keyword, inputChange, submit, isSubmitting, keywordSubmitSucceeded }
}
