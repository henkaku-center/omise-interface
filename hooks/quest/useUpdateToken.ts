import { useState } from 'react'
import { useContractWrite } from 'wagmi'
import kamonNFTContract from '@/utils/abis/kamonNFT.json'

const useUpdateOwnNFT = (
  contract: string,
  tokenId: BigInt,
  finalTokenUri: string,
) => {

  const {
    data: updateData,
    isError,
    writeAsync: update
  } = useContractWrite(
    {
      addressOrName: contract,
      contractInterface: kamonNFTContract.abi
    },
    'updateOwnNFT',
    {
      args: [tokenId, finalTokenUri],
    },
  )

  return {
    updateData,
    isError,
    update,
  }
}

export const useUpdateToken = (
  kamonNFT: string,
  tokenId: BigInt,
  finalTokenUri: string,
) => {  
  const { update } = useUpdateOwnNFT(
    kamonNFT,
    tokenId,
    finalTokenUri,
  )
  const [updateTokenIsSubmitting, setUpdateTokenIsSubmitting] = useState<boolean>()

  const updateToken = async () => {
    setUpdateTokenIsSubmitting(true)
    try {
      await update()
      setUpdateTokenIsSubmitting(false)
      return 'success'
    } catch (err) {
      setUpdateTokenIsSubmitting(false)
      const error = err as Error;
      if (error.name == 'UserRejectedRequestError') {
        return 'rejected'
      }
      return 'error'
    }
  }

  return { updateToken, updateTokenIsSubmitting }
}
