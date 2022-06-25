import { ethers } from 'ethers'
import { useState } from 'react'
import { useContractWrite, useContractEvent, useAccount } from 'wagmi'
import henkakuBadge from '@/utils/abis/henkakuBadge.json'

export const useMintBadge = (
  contract: string,
  owner: string | undefined,
  tokenID: number
) => {
  const { data } = useAccount()
  const [minted, setMinted] = useState<boolean>(false)
  const [isMinting, setIsMinting] = useState<boolean>(false)

  try {
    useContractEvent(
      {
        addressOrName: contract,
        contractInterface: henkakuBadge.abi
      },
      'TransferSingle',
      (event) => {
        const [operator, form, to, id] = event
        if (to == owner && id?.gt(0)) {
          setMinted(true)
          setIsMinting(false)
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
    data: mintData,
    isError,
    writeAsync: mint
  } = useContractWrite(
    {
      addressOrName: contract,
      contractInterface: henkakuBadge.abi
    },
    'mint',
    {
      args: [tokenID],
      onSuccess() {
        setIsMinting(true)
      }
    }
  )

  return {
    mintData,
    isError,
    isMinting,
    mint,
    minted
  }
}
