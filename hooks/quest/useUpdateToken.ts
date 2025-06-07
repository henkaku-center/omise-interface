import { useState } from 'react'
import { useContractWrite } from 'wagmi'
import kamonNFTContract from '@/utils/abis/kamonNFT.json'

export const useUpdateOwnNFT = (
  contract: string,
  tokenId: BigInt,
  finalTokenUri: string
) => {
  const {
    data: updateData,
    isError,
    isLoading: isUpdating,
    writeAsync: update
  } = useContractWrite({
    address: contract,
    abi: kamonNFTContract.abi,
    functionName: 'updateOwnNFT',
    args: [tokenId, finalTokenUri]
  })

  return {
    updateData,
    isError,
    update,
    isUpdating
  }
}
