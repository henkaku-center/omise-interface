import { getContractAddress } from '@/utils/contractAddress'
import { useAccount, useNetwork } from 'wagmi'
import { useUserAttribute } from '@/hooks/useUserAttribute'

export const useGetClaimableToken = () => {
  const { activeChain } = useNetwork()
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: activeChain?.id
  })
  const { data } = useAccount()

  const { data: userAttribute, isError, error } = useUserAttribute(kamonNFT, data?.address)
  return { claimableToken: userAttribute?.claimableToken, isError, error }
}
