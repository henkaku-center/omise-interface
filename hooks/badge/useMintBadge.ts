import { ethers } from 'ethers'
import { useState } from 'react'
import { useContractWrite, useContractEvent, useNetwork, useAccount } from 'wagmi'
import henkakuBadge from '@/utils/abis/henkakuBadge.json'
import { getContractAddress } from '@/utils/contractAddress'

export const useMintBadge = (
  tokenID: number
) => {
  const { activeChain } = useNetwork()
  const { data } = useAccount()
  const contractAddress = getContractAddress({ name: 'henkakuBadge', chainId: activeChain?.id })
  const [minted, setMinted] = useState<boolean>(false)
  const [isMinting, setIsminting] = useState<boolean>(false)

  try {
    useContractEvent(
      {
        addressOrName: contractAddress,
        contractInterface: henkakuBadge.abi
      },
      'TransferSingle',
      (event) => {
        const [operator, form, to, id] = event
        if (to == data?.address && id?.gt(0)) {
          setMinted(true)
          setIsminting(false)
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
      addressOrName: contractAddress,
      contractInterface: henkakuBadge.abi
    },
    'mint',
    {
      args: [tokenID],
      onSuccess() {
        setIsminting(true)
      }
    },
  )

  return {
    mintData,
    isError,
    isMinting,
    mint,
    minted
  }
}