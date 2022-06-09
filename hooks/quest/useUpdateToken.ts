import { useUpdateOwnNFT } from '@/hooks/useUpdateOwnNFT'
import { useToast } from '@/hooks/useToast'
import { useState } from 'react'

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
