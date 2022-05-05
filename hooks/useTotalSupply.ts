import { useNetwork, useContractRead } from 'wagmi'
import kamonNFTContract from 'utils/abis/kamonNFT.json'
import { getContractAddress } from 'utils/contractAddress'

export const useTotalSupply = () => {
  const { activeChain } = useNetwork()
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: activeChain?.id
  })

  const { data: totalSupply, isError } = useContractRead(
    {
      addressOrName: kamonNFT,
      contractInterface: kamonNFTContract.abi
    },
    'totalSupply'
  )

  return {
    totalSupply,
    isError
  }
}
