import { ethers } from 'ethers'
import { useState } from 'react'
import { useContractWrite, useContractEvent } from 'wagmi'
import Koukan from '@/utils/abis/HenkakuKoukan.json'

export const useKoukanClaimToken = (
  contract: string,
  address?: string
) => {
  const [isClaimed, setClaimed] = useState<boolean>(false)
  const [isClaiming, setClaiming] = useState<boolean>(false)
  try {
    useContractEvent(
      {
        addressOrName: contract,
        contractInterface: Koukan.abi
      },
      'Claim',
      (event) => {
        const [amount, owner] = event
        if (owner == address && amount?.gt(0)) {
          setClaiming(false)
          setClaimed(true)
        }
      }
    )
  } catch (e: any) {
    console.error(e) // with different chain it occurs
    if (e?.code != ethers.errors.INVALID_ARGUMENT) {
      throw e
    }
  }

  const {
    data: claimData,
    isError,
    writeAsync: claim
  } = useContractWrite(
    {
      addressOrName: contract,
      contractInterface: Koukan.abi
    },
    'claimV2Token',
    {
      args: [],
      onSuccess() {
        setClaiming(true)
      }
    },
  )

  return {
    claimData,
    isError,
    isClaiming,
    claim,
    isClaimed
  }
}
