import { useContractRead } from 'wagmi'
import henkakuBadge from '@/utils/abis/henkakuBadge.json'
import { ethers } from 'ethers'

export type BadgeElement = [
  boolean,
  boolean,
  ethers.BigNumber,
  ethers.BigNumber,
  string
]

export const useBadges = (contract: string) => {
  const { data: badges, isError } = useContractRead(
    {
      addressOrName: contract,
      contractInterface: henkakuBadge.abi
    },
    'getBadges'
  )

  return {
    badges,
    isError
  }
}
