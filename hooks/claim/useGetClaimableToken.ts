import { getContractAddress } from '@/utils/contractAddress'
import { useAccount, useNetwork } from 'wagmi'
import { useUserAttribute } from '@/hooks/useUserAttribute'

export const useGetClaimableToken = () => {
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
    claimableToken: userAttribute?.claimableToken,
    isError,
    error,
    refetchClaimableToken: refetch
  }
}
