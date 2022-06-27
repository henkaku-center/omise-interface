import { useContractRead } from 'wagmi'
import henkakuBadge from '@/utils/abis/henkakuBadge.json'
import { useState } from 'react'

export const useTotalSupply = (contract: string, tokenId: number) => {
  const { data: totalSupply, isError } = useContractRead(
    {
      addressOrName: contract,
      contractInterface: henkakuBadge.abi
    },
    'totalSupply',
    {
      args: [tokenId]
    }
  )

  return {
    totalSupply,
    isError
  }
}
