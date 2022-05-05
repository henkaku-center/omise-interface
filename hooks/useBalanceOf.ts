import { useNetwork, useContractRead } from 'wagmi'
import kamonNFTContract from 'utils/abis/kamonNFT.json'
import { getContractAddress } from 'utils/contractAddress'

export const useBalanceOf = (owner: string | undefined) => {
  const { activeChain } = useNetwork()
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: activeChain?.id
  })

  const { data: balanceOf, isError } = useContractRead(
    {
      addressOrName: kamonNFT,
      contractInterface: kamonNFTContract.abi
    },
    'balanceOf',
    {
      args: owner
    }
  )

  return {
    balanceOf,
    isError
  }
}
