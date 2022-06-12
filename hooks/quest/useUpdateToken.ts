import { useState } from 'react'
import { useContractWrite } from 'wagmi'
import kamonNFTContract from '@/utils/abis/kamonNFT.json'
import { useToast } from '@/hooks/useToast'

const useUpdateOwnNFT = (
  contract: string,
  tokenId: BigInt,
  finalTokenUri: string,
) => {
  const [updated, setUpdated] = useState<boolean>(false)

  const {
    data: updateData,
    isError,
    isLoading: updateOwnNftIsSubmitting,
    writeAsync: update
  } = useContractWrite(
    {
      addressOrName: contract,
      contractInterface: kamonNFTContract.abi
    },
    'updateOwnNFT',
    {
      args: [tokenId, finalTokenUri],
      onSuccess() {
        setUpdated(true)
      }
    },
  )

  return {
    updateData,
    updateOwnNftIsSubmitting,
    isError,
    update,
    updated
  }
}

export const useUpdateToken = (
  kamonNFT: string,
  tokenId: BigInt,
  finalTokenUri: string,
) => {  
  const { toast } = useToast()
  const { update, updated, updateOwnNftIsSubmitting } = useUpdateOwnNFT(
    kamonNFT,
    tokenId,
    finalTokenUri,
  )
  const [updateTokenSucceeded, setUpdateTokenSucceeded] = useState<boolean>()
  const [updateTokenIsSubmitting, setUpdateTokenIsSubmitting] = useState<boolean>()

  const updateToken = async () => {
    setUpdateTokenIsSubmitting(true)
    try {
      await update()
      setUpdateTokenIsSubmitting(false)
      setUpdateTokenSucceeded(true)
      toast({
        title: 'Kamon updated',
        description: 'NFT metadata and image successfully updated.',
        status: 'success'
      })
      return true
    } catch (err) {
      setUpdateTokenIsSubmitting(false)
      setUpdateTokenSucceeded(false)
      const error = err as Error;
      if (error.name == 'UserRejectedRequestError') {
        toast({
          title: 'Transaction Rejected',
          description: 'You rejected the transaction to update your Kamon NFT. Please reload this page and retry.',
          status: 'error'
        })
      } else {
        toast({
          title: 'Error',
          description: 'The transaction failed.',
          status: 'error'
        })
      }
      return false
    }
  }

  return { updateToken, updateTokenSucceeded, updateTokenIsSubmitting }
}
