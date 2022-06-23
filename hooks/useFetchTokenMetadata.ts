import axios, { AxiosError } from 'axios'

export const useFetchTokenMetadata = () => {  

  const fetchTokenMetadata = async (tokenUri: string) => {
    try {
      const newTokenRequest = await axios.get(tokenUri)
      return newTokenRequest.data
    } catch (err) {
      const error = err as Error | AxiosError;
      if(axios.isAxiosError(error)){
        return { image: 'Error ' + error?.response?.status }
      } else {
        return { image: 'Error' }
      }
    }
  }

  return { fetchTokenMetadata }
}
