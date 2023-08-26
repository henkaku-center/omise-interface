import { useContractRead } from 'wagmi'
import henkakuBadge from '@/utils/abis/henkakuBadge.json'
import { ethers } from 'ethers'

export type BadgeElement = [
  number,
  boolean,
  boolean,
  ethers.BigNumber,
  ethers.BigNumber,
  string
]

export const useBadges = (contract: string) => {
  const { data: badgeList, isError } = useContractRead(
    {
      addressOrName: contract,
      contractInterface: henkakuBadge.abi
    },
    'getBadges'
  )

  const badges = badgeList?.map(
    (subArray, index) => [index + 1, ...subArray] as BadgeElement
  )

  return {
    badges,
    isError
  }
}
