import { useContractRead } from 'wagmi'
import kamonNFTContract from '@/utils/abis/kamonNFT.json'
import { ethers } from 'ethers'

export const useBalanceOf = (contract: string, owner: string | undefined) => {
  const { data: balanceOf, isError } = useContractRead(
    {
      addressOrName: contract,
      contractInterface: kamonNFTContract.abi
    },
    'balanceOf',
    {
      args: owner || ethers.constants.AddressZero,
      watch: true
    }
  )

  return {
    balanceOf,
    hasNft: balanceOf?.gt(0),
    isError
  }
}
