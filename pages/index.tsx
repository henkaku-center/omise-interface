import type { NextPage } from 'next'
import { useNetwork } from 'wagmi'
import { useEffect, useState } from 'react'
import { Button, Text, Heading, Image, SimpleGrid, Box } from '@chakra-ui/react'
import { Layout } from '@/components/layouts/layout'
import { getContractAddress } from '@/utils/contractAddress'
import { useTotalSupply } from '@/hooks/useTotalSupply'
import { useTokenURI } from '@/hooks/useTokenURI'
import { useLocale } from '@/hooks/useLocale'

const Home: NextPage = () => {
  const { locale, t } = useLocale()
  const { activeChain } = useNetwork()
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: activeChain?.id
  })
  const openSeaTokenBaseUrl = `https://testnets.opensea.io/assets/${kamonNFT}/`
  const { totalSupply } = useTotalSupply(kamonNFT)
  const { tokenURI } = useTokenURI(kamonNFT, Number(totalSupply))

  // useState
  const [tokenURIImage, setTokenImageURI] = useState('')

  useEffect(() => {
    if (totalSupply && tokenURI) {
      const fetchData = async () => {
        const pinataRequest = await fetch(tokenURI.toString())
        const responseJson = await pinataRequest.json()

        setTokenImageURI(responseJson.image)
      }

      fetchData()
    }
  }, [tokenURI, totalSupply])

  return (
    <>
      <Layout>
        <Heading as="h2" color="gray.600">
          {t.MINT_YOUR_KAMON_HEADING}{' '}
        </Heading>
        <Text m="1rem">Kamon NFT is membership of henkaku community</Text>
        <SimpleGrid columns={{ sm: 1, md: 1, lg: 2 }} spacing="10px">
          <div>
            {tokenURIImage ? (
              <Image src={tokenURIImage} alt="" />
            ) : (
              <Image src={'/kamonNFT_427@2x.png'} alt="" />
            )}
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
