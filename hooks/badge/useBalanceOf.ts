import { useContractRead, useNetwork } from 'wagmi'
import henkakuBadge from '@/utils/abis/henkakuBadge.json'
import { getContractAddress } from '@/utils/contractAddress'

export const useBadgeBalanceOf = (owner: string | undefined, tokenId: number | undefined) => {
  const { activeChain } = useNetwork()
  const contractAddress = getContractAddress({ name: 'henkakuBadge', chainId: activeChain?.id })
  const { data: balanceOf, isError } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: henkakuBadge.abi
    },
    'balanceOf',
    {
      args: [owner, tokenId],
      watch: true
    }
  )

  return {
    balanceOf,
    hasNft: balanceOf?.gt(0),
    isError
  }
}
