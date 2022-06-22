import { useState } from 'react'
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

export const useUpdateTokenMetadata = () => {  
  const { toast } = useToast()
  const { refetchPoint } = useGetPoint()
  const [updateTokenMetadataSucceeded, setUpdateTokenMetadataSucceeded] = useState<boolean>()
  const [updateTokenMetadataIsSubmitting, setUpdateTokenMetadataIsSubmitting] = useState<boolean>()
  const ipfsApiEndpoint = process.env.NEXT_PUBLIC_IPFS_API_URI + ''

  const updateTokenMetadata = async (tokenJSON: KamonToken, userAddress: string) => {
    setUpdateTokenMetadataIsSubmitting(true)
    let dateFromToken = 0
    let rolesFromToken: string[] = []
    const onTokenPointsAttr: TokenAttribute | undefined = tokenJSON?.attributes.find(elem => elem.trait_type == 'Points')
    const onTokenPoints = onTokenPointsAttr?.value
    const updatedPointsQuery = await refetchPoint()
    const updatedPoints = Array.isArray(updatedPointsQuery.data)? updatedPointsQuery.data[0]: 0
    const updatedPointsInt = parseInt(updatedPoints.toString())
    if(onTokenPoints == updatedPointsInt) {
      // console.log('No need to update the NFT')
      setUpdateTokenMetadataSucceeded(false)
      return('same_points') // Comment block for debugging
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
      setUpdateTokenMetadataIsSubmitting(false)
      setUpdateTokenMetadataSucceeded(true)
      return(ipfsRequest.data.tokenUri)
    } catch (err) {
      setUpdateTokenMetadataIsSubmitting(false)
      setUpdateTokenMetadataSucceeded(false)
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

  return { updateTokenMetadata, updateTokenMetadataIsSubmitting, updateTokenMetadataSucceeded }
}
