import { ethers } from 'ethers'
import { useContractWrite, useContractEvent } from 'wagmi'
import kamonNFTContract from '@/utils/abis/kamonNFT.json'

export const useMintWithHenkaku = (
  contract: string,
  tokenUri: string,
  amount: number
) => {
  try {
    useContractEvent(
      {
        addressOrName: contract,
        contractInterface: kamonNFTContract.abi
      },
      'BoughtMemberShipNFT',
      (event) => console.log(event)
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
    isLoading: isMinting,
    writeAsync: mint
  } = useContractWrite(
    {
      addressOrName: contract,
      contractInterface: kamonNFTContract.abi
    },
    'mintWithHenkaku',
    {
      args: [tokenUri, ethers.utils.parseEther(amount.toString())]
    }
  )

  return {
    mintData,
    isError,
    isMinting,
    mint
  }
}
