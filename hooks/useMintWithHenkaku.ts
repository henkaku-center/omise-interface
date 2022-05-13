import { ethers } from 'ethers'
import { useState } from 'react'
import { useContractWrite, useContractEvent } from 'wagmi'
import kamonNFTContract from '@/utils/abis/kamonNFT.json'

export const useMintWithHenkaku = (
  contract: string,
  tokenUri: string,
  amount: number,
  address?: string
) => {
  const [minted, setMinted] = useState<boolean>(false)
  const [isMinting, setIsminting] = useState<boolean>(false)
  try {
    useContractEvent(
      {
        addressOrName: contract,
        contractInterface: kamonNFTContract.abi
      },
      'BoughtMemberShipNFT',
      (event) => {
        const [owner, tokenId] = event
        if (owner == address && tokenId?.gt(0)) {
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
      addressOrName: contract,
      contractInterface: kamonNFTContract.abi
    },
    'mintWithHenkaku',
    {
      args: [tokenUri, ethers.utils.parseEther(amount.toString())],
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
