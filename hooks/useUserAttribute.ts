import { useContractRead } from 'wagmi'
import kamonNFTContract from '@/utils/abis/kamonNFT.json'
import { ethers } from 'ethers'

type UserAttribute = {
  point: number
  claimableToken: number
  answeredAt: string
}

export const useUserAttribute = (
  contract: string,
  owner: string | undefined
): { data?: UserAttribute; isError: boolean; error: Error | null } => {
  const {
    data: data,
    isError,
    error
  } = useContractRead(
    {
      addressOrName: contract,
      contractInterface: kamonNFTContract.abi
    },
    'userAttribute',
    {
      args: owner || ethers.constants.AddressZero,
      enabled: false
    }
  )

  return {
    data: data
      ? {
          point: data.point,
          claimableToken: data.claimableToken,
          answeredAt: data.answeredAt
        }
      : undefined,
    isError,
    error
  }
}
