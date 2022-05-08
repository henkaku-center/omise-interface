import type { NextPage } from 'next'
import { useAccount } from 'wagmi'
import { Button, Text, Heading, Image, SimpleGrid, Box } from '@chakra-ui/react'
import { Layout } from '@/components/layouts/layout'

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <Heading as="h2" color="gray.600">
          Mint your Kamon - 家紋{' '}
        </Heading>
        <Text m="1rem">Kamon NFT is membership of henkaku community</Text>
        <SimpleGrid columns={{ sm: 1, md: 1, lg: 2 }} spacing="10px">
          <div>
            <Image src={'/kamonNFT.svg'} alt="" />
          </div>
          <div>
            <Box w="100%" p={4} color="grey.600">
              <Heading as="h3" fontSize="1.2rem">
                Kamon - 家紋 NFT costs 1000 $HENKAKU
              </Heading>
              <Text m="1rem">Excluding Gas fee</Text>
              <Button as="a" href="/mintKamon" size="lg" colorScheme="teal">
                Go and Mint your NFT
              </Button>
            </Box>
          </div>
        </SimpleGrid>
      </Layout>
    </>
  )
}

export default Home
