import { Heading, Text } from '@chakra-ui/react'
import { Approve } from '@/components/metaMask/Approve'

interface Props {
  erc20: string
  spender: string
}

export const ApproveForKamon: React.FC<Props> = ({ erc20, spender }) => {

  return (
    <>
      <Heading as="h2" color="white.600">
        Mint your Kamon - 家紋{' '}
      </Heading>
      <Text m="1rem">Kamon NFT is membership of henkaku community</Text>
      <Text>To mint your Kamon NFT - 家紋 enable your wallet to buy</Text>
      <Approve erc20={erc20} spender={spender}>
        Enable to get kamon nft
      </Approve>
    </>
  )
}
