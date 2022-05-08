import { APPROVE_CALLBACK_STATUS, useApprove } from '@/hooks/useApproval'
import { Heading, Text, Button } from '@chakra-ui/react'

interface Props {
  erc20: string
  spender: string
}

export const Approve: React.FC<Props> = ({ erc20, spender }) => {
  const { status, approve } = useApprove(erc20, spender)

  return (
    <>
      <Heading as="h2" color="gray.600">
        Mint your Kamon - 家紋{' '}
      </Heading>
      <Text m="1rem">Kamon NFT is membership of henkaku community</Text>
      <Text>To mint your Kamon NFT - 家紋 enable your wallet to buy</Text>
      <Button
        colorScheme="teal"
        mt={2}
        onClick={approve}
        isLoading={status == APPROVE_CALLBACK_STATUS.PENDING}
      >
        Enable to get kamon nft
      </Button>
    </>
  )
}
