import { useContractRead } from 'wagmi'
import kamonNFTContract from '@/utils/abis/kamonNFT.json'

export const useTokenIdOf = (contract: string, owner?: string) => {
  const { data: tokenIdOf, isError } = useContractRead({
    address: contract,
    abi: kamonNFTContract.abi,
    functionName: 'tokenIdOf',
    args: owner ? [owner] : undefined
  })

  return {
    tokenIdOf,
    isError
  }
}
