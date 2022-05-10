import { NextPage } from 'next'
import { useMounted } from '@/hooks/useMounted'
import { useAccount, useConnect } from 'wagmi'
import { Layout } from '@/components/layouts/layout'
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Spacer,
  Stack,
  Text
} from '@chakra-ui/react'
import { useClaim } from '@/hooks/claim/useClaim'
import { useGetClaimableToken } from '@/hooks/quest/useGetClaimableToken'
import { useHasNFT } from '@/hooks/useHasNFT'
import Link from 'next/link'

const Claim: NextPage = () => {
  const mounted = useMounted()
  const { connect, connectors } = useConnect()
  const [metaMask] = connectors
  const { data } = useAccount()
  const { claim, isClaiming } = useClaim()
  const { claimableToken } = useGetClaimableToken()
  const { hasNFT } = useHasNFT()

  return (
    <>
      <Layout>
        <Heading mt={50}>Claim</Heading>
        <Flex direction={{ base: 'column', sm: 'row' }}>
          <Flex
            px={2}
            mt={4}
            order={{ base: 2, sm: 1 }}
            direction={'column'}
            justifyContent={'center'}
          >
            <Box w="100%" p={4}>
              <Heading size="md">
                {hasNFT ? 'Claim your token' : "Let's get NFT first!"}
              </Heading>
              <Text>
                {hasNFT
                  ? 'You can claim your $HENKAKU.'
                  : 'You can claim $HENKAKU if you own NFT.'}
              </Text>
              {hasNFT && claimableToken ? (
                <Text>{`You can get ${claimableToken} $HENKAKU`}</Text>
              ) : null}
            </Box>
            {mounted && !data?.address ? (
              <Button
                mt={10}
                w="100%"
                colorScheme="teal"
                onClick={() => connect(metaMask)}
              >
                connect wallet
              </Button>
            ) : hasNFT ? (
              <Button
                mt={10}
                w="100%"
                colorScheme="teal"
                onClick={() => claim()}
                isLoading={isClaiming}
                loadingText="claiming..."
              >
                Claim
              </Button>
            ) : (
              <Link href="/" passHref>
                <Button mt={10} w="100%" colorScheme="teal">
                  Mint Your NFT
                </Button>
              </Link>
            )}
          </Flex>
          <Spacer />
          <Box p={10} mx={'auto'} minW={200} order={{ base: 1, sm: 2 }}>
            <Image src="/henkaku-token.png" alt="$HENKAKU" />
          </Box>
        </Flex>
      </Layout>
    </>
  )
}

export default Claim
