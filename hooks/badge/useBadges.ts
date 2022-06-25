import { useContractRead } from 'wagmi'
import henkakuBadge from '@/utils/abis/henkakuBadge.json'
import { useState } from 'react'

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
