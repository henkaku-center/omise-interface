import type { NextPage } from 'next'
import { useAccount, useNetwork } from 'wagmi'
import { useEffect, useState } from 'react'
import {
  Button,
  Text,
  Heading,
  Image,
  SimpleGrid,
  Box,
  Link,
  Spacer
} from '@chakra-ui/react'
import { default as NextLink } from 'next/link'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { Layout } from '@/components/layouts/layout'
import { getContractAddress } from '@/utils/contractAddress'
import { useTotalSupply } from '@/hooks/useTotalSupply'
import { useMounted } from '@/hooks/useMounted'
import { useBalanceOf } from '@/hooks/useBalanceOf'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useTokenIdOf } from '@/hooks/useTokenIdOf'
import { useTokenURI } from '@/hooks/useTokenURI'

const Home: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const { activeChain } = useNetwork()
  const { data } = useAccount()
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: activeChain?.id
  })
  const openSeaTokenBaseUrl = `https://opensea.io/assets/matic/${kamonNFT}/`
  const { balanceOf } = useBalanceOf(kamonNFT, data?.address)
  const { tokenIdOf } = useTokenIdOf(kamonNFT, data?.address)
  const { totalSupply } = useTotalSupply(kamonNFT)
  const { tokenURI } = useTokenURI(kamonNFT, tokenIdOf?.toNumber() || 1)

  const mounted = useMounted()

  const [tokenURIImage, setTokenImageURI] = useState('')

  useEffect(() => {
    if (balanceOf && tokenIdOf && tokenURI) {
      const fetchData = async () => {
        const pinataRequest = await fetch(tokenURI.toString())
        const responseJson = await pinataRequest.json()

        setTokenImageURI(responseJson.image)
      }

      fetchData()
    }
  }, [balanceOf, tokenIdOf, tokenURI])

  return (
    <>
      <Layout>
        <Heading as="h2" color="white.600">
          {t('MINT_YOUR_KAMON_HEADING')}{' '}
        </Heading>
        <Text mt="1rem">{t('MINT_YOUR_KAMON_EXPLANATION')} </Text>
        {mounted && totalSupply && (
          <Text mb="1rem">
            {t('CURRENT_HOLDERS_1')}
            {totalSupply.toString()}
            {t('CURRENT_HOLDERS_2')}
          </Text>
        )}
        <SimpleGrid columns={{ sm: 1, md: 1, lg: 2 }} spacing="10px">
          <div>
            {mounted && tokenIdOf?.gt(0) && tokenURIImage ? (
              <Image src={tokenURIImage} alt="" />
            ) : (
              <Image src={'/kamonNFT_427@2x.png'} alt="" />
            )}
          </div>
          <div>
            <Box w="100%" p={4} color="grey.600">
              <Heading as="h3" fontSize="1.2rem">
                {t('MINT_YOUR_KAMON_DETAILS')}
              </Heading>
              <Text m="1rem">{t('MINT_YOUR_KAMON_DETAILS_NOTE')}</Text>
              {mounted && balanceOf?.gte(1) ? (
                <>
                  <Button disabled={true} size="lg" colorScheme="teal">
                    {t('MINT_YOUR_KAMON_DISABLED_BUTTON_HOLDER')}
                  </Button>
                  <Spacer mt={5} />
                  <Link href={`${openSeaTokenBaseUrl}`} isExternal>
                    {t('MINT_YOUR_KAMON_OPENSEA_INSTRUCTION')}
                    <ExternalLinkIcon mx="2px" />
                  </Link>
                </>
              ) : (
                <NextLink href="/mintKamon" locale={router.locale} passHref>
                  <Button as="a" size="lg" colorScheme="teal">
                    {t('MINT_YOUR_KAMON_BUTTON')}
                  </Button>
                </NextLink>
              )}
            </Box>
          </div>
        </SimpleGrid>
        <Heading as="h2" mt="1rem" color="white.600">
          {t('BADGE_STORE_HEADING')}{' '}
        </Heading>
        <NextLink href="/quests" locale={router.locale} passHref>
          <Image src="/storeBanner.png" mt="1rem" alt="" />
        </NextLink>
        <SimpleGrid mt="1rem" columns={2}>
          <div>
            <NextLink href="/quests" locale={router.locale} passHref>
              <Button as="a" size="lg" colorScheme="teal">
              {t('BADGE_STORE_BUTTON')}
              </Button>
            </NextLink>
          </div>
        </SimpleGrid>
      </Layout>
    </>
  )
}

export default Home
