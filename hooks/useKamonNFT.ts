import { useNetwork, useSigner } from 'wagmi'
import { ethers } from 'ethers'
import { PodCastNFT__factory } from '@/contracts/types/factories/PodCastNFT__factory'
import { getContractAddress } from 'utils/contractAddress'

export const useKamonNFT = () => {
  const { activeChain } = useNetwork()
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: activeChain?.id
  })

  const provider = new ethers.providers.JsonRpcProvider()
  const { data: signer } = useSigner()
  const contract = PodCastNFT__factory.connect(kamonNFT, signer ?? provider)
  return { contract }
}
