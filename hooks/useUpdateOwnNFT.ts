import { useState } from 'react'
import { useContractWrite } from 'wagmi'
import kamonNFTContract from '@/utils/abis/kamonNFT.json'

export const useUpdateOwnNFT = (
  contract: string,
  tokenId: BigInt,
  finalTokenUri: string,
) => {
  const [updated, setUpdated] = useState<boolean>(false)

  const {
    data: updateData,
    isError,
    writeAsync: update
  } = useContractWrite(
    {
      addressOrName: contract,
      contractInterface: kamonNFTContract.abi
    },
    'updateOwnNFT',
    {
      args: [tokenId, finalTokenUri],
      onSuccess() {
        setUpdated(true)
      }
    },
  )

  return {
    updateData,
    isError,
    update,
    updated
  }
}
