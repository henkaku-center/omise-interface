import { useContractRead } from 'wagmi'
import henkakuBadge from '@/utils/abis/henkakuBadge.json'

export const useBadgeBalanceOf = (
  contract: string,
  owner: string | undefined,
  tokenId: number | undefined
) => {
  const { data: balanceOf, isError } = useContractRead(
    {
      addressOrName: contract,
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
