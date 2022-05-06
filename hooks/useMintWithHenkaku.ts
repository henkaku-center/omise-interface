import { ethers } from 'ethers'
import { useNetwork, useContractWrite, useContractEvent } from 'wagmi'
import kamonNFTContract from '@/utils/abis/kamonNFT.json'
import { getContractAddress } from '@/utils/contractAddress'

export const useMintWithHenkaku = (tokenUri: string, amount: number) => {
  const { activeChain } = useNetwork()
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: activeChain?.id
  })

  useContractEvent(
    {
      addressOrName: kamonNFT,
      contractInterface: kamonNFTContract.abi
    },
    'BoughtMemberShipNFT',
    (event) => console.log(event)
  )

  const {
    data: mintData,
    isError,
    isLoading: isMinting,
    writeAsync: mint
  } = useContractWrite(
    {
      addressOrName: kamonNFT,
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
