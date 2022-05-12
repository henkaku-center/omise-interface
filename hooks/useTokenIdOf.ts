import { useContractRead } from 'wagmi'
import kamonNFTContract from '@/utils/abis/kamonNFT.json'

export const useTokenIdOf = (contract: string, owner?: string) => {
  const { data: tokenIdOf, isError } = useContractRead(
    {
      addressOrName: contract,
      contractInterface: kamonNFTContract.abi
    },
    'tokenIdOf',
    {
      args: owner
    }
  )

  return {
    tokenIdOf,
    isError
  }
}
