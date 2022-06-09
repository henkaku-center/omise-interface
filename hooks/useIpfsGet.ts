import { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useToast } from '@/hooks/useToast'

export const useIpfsGet = () => {  
  const { toast } = useToast()
  const [ipfsGetSucceeded, setIpfsGetSucceeded] = useState<boolean>()
  const [ipfsGetIsSubmitting, setIpfsGetIsSubmitting] = useState<boolean>()

  const ipfsGet = async (tokenUri: string) => {
    try {
      setIpfsGetIsSubmitting(true)
      const newTokenRequest = await axios.get(tokenUri)
      setIpfsGetIsSubmitting(false)
      setIpfsGetSucceeded(true)
      return newTokenRequest.data
    } catch (err) {
      setIpfsGetIsSubmitting(false)
      setIpfsGetSucceeded(false)
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

  return { ipfsGet, ipfsGetSucceeded, ipfsGetIsSubmitting }
}
