import axios, { AxiosError } from 'axios'
import { useToast } from '@/hooks/useToast'

export const useIpfsGet = () => {  
  const { toast } = useToast()

  const ipfsGet = async (tokenUri: string) => {
    try {
      const newTokenRequest = await axios.get(tokenUri)
      return newTokenRequest.data
    } catch (err) {
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

  return { ipfsGet }
}
