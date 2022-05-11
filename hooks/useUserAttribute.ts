import { useContractRead } from 'wagmi'
import kamonNFTContract from '@/utils/abis/kamonNFT.json'
import { BigNumber, ethers } from 'ethers'

export const useUserAttribute = (
  contract: string,
  owner: string | undefined
) => {
  const {
    data: data,
    isError,
    error,
    refetch
  } = useContractRead(
    {
      addressOrName: contract,
      contractInterface: kamonNFTContract.abi
    },
    'userAttribute',
    {
      args: owner || ethers.constants.AddressZero,
      watch: true
    }
  )

  return {
    data:
      data && data.length == 3
        ? {
            point: (data[0] as BigNumber).toBigInt(),
            claimableToken: (data[1] as BigNumber).toBigInt(),
            answeredAt: (data[2] as BigNumber).toBigInt()
          }
        : undefined,
    isError,
    error,
    refetch
  }
}
