import axios, { AxiosError } from 'axios'
import { useToast } from '@/hooks/useToast'
import { useGetPoint } from '@/hooks/quest/useGetPoint'

export interface TokenAttribute {
  display_type: string | undefined
  trait_type: string
  value: number | string
}
export interface KamonToken {
  name: string
  description: string
  image: string
  attributes: TokenAttribute[]
}

export const useIpfsSubmit = () => {  
  const { toast } = useToast()
  const { point, refetchPoint } = useGetPoint()
  const ipfsApiEndpoint = process.env.NEXT_PUBLIC_IPFS_API_URI + ''

  const ipfsSubmit = async (tokenJSON: KamonToken, userAddress: string) => {
    let dateFromToken = 0
    let rolesFromToken: string[] = []
    const onTokenPointsAttr: TokenAttribute | undefined = tokenJSON?.attributes.find(elem => elem.trait_type == 'Points')
    const onTokenPoints = onTokenPointsAttr?.value
    const updatedPointsQuery = await refetchPoint()
    const updatedPoints = Array.isArray(updatedPointsQuery.data)? updatedPointsQuery.data[0]: 0
    const updatedPointsInt = parseInt(updatedPoints.toString())
    if(onTokenPoints == updatedPointsInt) {
      // console.log('No need to update the NFT')
      return('same_points') // Comment for debugging
    }
    tokenJSON?.attributes.forEach((attr: TokenAttribute) => {
      if (attr.trait_type == 'Date') {
        dateFromToken = parseInt(attr.value.toString())
      } else if (attr.trait_type == 'Role') {
        rolesFromToken.push(attr.value.toString())
      }
    })
    const payload = {
      address: userAddress,
      roles: rolesFromToken,
      points: updatedPointsInt,
      date: dateFromToken,
    }

    toast({
      title: 'Updating Kamon NFT',
      description: 'Generating an image with your new point total. Please wait...',
      status: 'info'
    })
    try {
      const ipfsRequest = await axios.post(ipfsApiEndpoint, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return(ipfsRequest.data.tokenUri)
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
        description: 'Could not generate your new image.',
        status: 'error'
      })
      return('error')
    }
  }

  return { ipfsSubmit }
}
