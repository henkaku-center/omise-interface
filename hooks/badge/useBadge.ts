import { chainId, useContractRead, useNetwork } from 'wagmi'
import henkakuBadge from '@/utils/abis/henkakuBadge.json'
import { getContractAddress } from '@/utils/contractAddress'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

export interface Badge {
  mintable: boolean
  transferable: boolean
  amount: ethers.BigNumber
  maxSupply: ethers.BigNumber
  tokenURI: string
}

const BADGE_ELEMENT_SIZE = 5

export const useBadge = (id: number) => {
  const { activeChain } = useNetwork()
  const contractAddress = getContractAddress({ name: 'henkakuBadge', chainId: activeChain?.id })
  const [badge, setBadge] = useState<Badge>()
  const { data, isError } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: henkakuBadge.abi
    },
    'badges',
    {
      args: [id]
    }
  )

  useEffect(() => {
    if (data && data.length == BADGE_ELEMENT_SIZE) {
      const [mintable, transferable, amount, maxSupply, tokenURI] = data
      setBadge({ mintable, transferable, amount, maxSupply, tokenURI })
    }
  }, [data])

  return {
    badge,
    isError
  }
}