import { getContractAddress } from '@/utils/contractAddress'
import { useAccount, useNetwork } from 'wagmi'
import { useUserAttribute } from '@/hooks/useUserAttribute'

export const useGetPoint = () => {
  const { chain } = useNetwork()
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: chain?.id
  })
  const { data } = useAccount()

  const {
    data: userAttribute,
    isError,
    error,
    refetch
  } = useUserAttribute(kamonNFT, data?.address)

  return {
    point: userAttribute?.point,
    isError,
    error,
    refetchPoint: refetch
  }
}
