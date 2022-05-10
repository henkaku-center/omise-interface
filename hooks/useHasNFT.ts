import { useEffect, useState } from 'react'
import { useBalanceOf } from '@/hooks/useBalanceOf'
import { getContractAddress } from '@/utils/contractAddress'
import { useAccount, useNetwork } from 'wagmi'

export const useHasNFT = () => {
  const [hasNFT, setHasNFT] = useState(false)
  const { activeChain } = useNetwork()
  const { data } = useAccount()
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: activeChain?.id
  })
  const { balanceOf } = useBalanceOf(kamonNFT, data?.address)

  useEffect(() => {
    setHasNFT(!!(balanceOf && balanceOf.gte(1) > 0))
  }, [balanceOf, data?.address])

  return { hasNFT }
}
