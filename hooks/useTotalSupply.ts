import { useContractRead } from 'wagmi'
import kamonNFTContract from '@/utils/abis/kamonNFT.json'

export const useTotalSupply = (contract: string) => {
  const { data: totalSupply, isError } = useContractRead(
    {
      addressOrName: contract,
      contractInterface: kamonNFTContract.abi
    },
    'totalSupply'
  )

  return {
    totalSupply,
    isError
  }
}
