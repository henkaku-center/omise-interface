import { WriteContractConfig } from '@wagmi/core'
import { UseContractWriteConfig } from 'wagmi/dist/declarations/src/hooks/contracts/useContractWrite'
import { useContractWrite, useNetwork } from 'wagmi'
import kamonNFTContract from '@/utils/abis/kamonNFT.json'
import { getContractAddress } from '@/utils/contractAddress'

export const useClaimToken = (
  option?: Partial<WriteContractConfig> & UseContractWriteConfig
) => {
  const { activeChain } = useNetwork()
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: activeChain?.id
  })

  const { write: claim, isLoading: isClaiming } = useContractWrite(
    {
      addressOrName: kamonNFT,
      contractInterface: kamonNFTContract.abi
    },
    'claimToken',
    option
  )

  return { claim, isClaiming }
}
