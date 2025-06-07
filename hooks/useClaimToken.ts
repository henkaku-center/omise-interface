import { WriteContractConfig } from '@wagmi/core'
import { UseContractWriteConfig } from 'wagmi/dist/declarations/src/hooks/contracts/useContractWrite'
import { useContractWrite, useNetwork } from 'wagmi'
import kamonNFTContract from '@/utils/abis/kamonNFT.json'
import { getContractAddress } from '@/utils/contractAddress'

export const useClaimToken = (
  option?: Partial<WriteContractConfig> & UseContractWriteConfig
) => {
  const { chain } = useNetwork()
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: chain?.id
  })

  const { write: claim, isLoading: isClaiming } = useContractWrite({
    address: kamonNFT,
    abi: kamonNFTContract.abi,
    functionName: 'claimToken',
    ...option
  })

  return { claim, isClaiming }
}
