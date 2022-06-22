import { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useToast } from '@/hooks/useToast'

export const useFetchTokenMetadata = () => {  
  const { toast } = useToast()
  const [fetchTokenMetadataSucceeded, setFetchTokenMetadataSucceeded] = useState<boolean>()
  const [fetchTokenMetadataIsSubmitting, setFetchTokenMetadataIsSubmitting] = useState<boolean>()

  const fetchTokenMetadata = async (tokenUri: string) => {
    try {
      setFetchTokenMetadataIsSubmitting(true)
      const newTokenRequest = await axios.get(tokenUri)
      setFetchTokenMetadataIsSubmitting(false)
      setFetchTokenMetadataSucceeded(true)
      return newTokenRequest.data
    } catch (err) {
      setFetchTokenMetadataIsSubmitting(false)
      setFetchTokenMetadataSucceeded(false)
      const error = err as Error | AxiosError;
      let title = ''
      if(axios.isAxiosError(error)){
        title = 'Error ' + error?.response?.status
      } else {
        title = 'Error'
      }
      toast({
        title: title,
        description: 'Could not get the data for your token.',
        status: 'error'
      })
      return 'error'
    }
  }

  return { fetchTokenMetadata, fetchTokenMetadataSucceeded, fetchTokenMetadataIsSubmitting }
}
