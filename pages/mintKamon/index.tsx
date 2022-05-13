import type { NextPage } from 'next'
import { useAccount, useNetwork, useConnect } from 'wagmi'
import {
  Button,
  Heading,
  Link,
  Center,
  Text,
  SimpleGrid,
  Image,
  Box,
  Badge
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Layout } from '@/components/layouts/layout'
import {
  GenerateImageForm,
  ApproveForKamon,
  PreviewNFTImage
} from '@/components/mintKamon/'
import { useMounted } from '@/hooks/useMounted'
import { useApproval } from '@/hooks/useApproval'
import { getContractAddress } from '@/utils/contractAddress'
import { useMintWithHenkaku } from '@/hooks/useMintWithHenkaku'
import { useBalanceOf } from '@/hooks/useBalanceOf'
import { useTotalSupply } from '@/hooks/useTotalSupply'

const MintKamon: NextPage = () => {
  const { t } = useTranslation('common')
  const mounted = useMounted()
  const { activeChain } = useNetwork()
  const { data } = useAccount()
  const henkakuErc20 = getContractAddress({
    name: 'henkakuErc20',
    chainId: activeChain?.id
  })
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: activeChain?.id
  })
  const openSeaTokenBaseUrl = `https://opensea.io/assets/matic/${kamonNFT}/`

  // useState
  const [tokenURI, setTokenURI] = useState('')
  const [tokenURIImage, setTokenImageURI] = useState('')
  const [hasNFT, setHasNFT] = useState(false)

  /// connect
  const { connect, connectors, error, isConnected } = useConnect()
  const [metaMask] = connectors

  // approve
  const approved = useApproval(henkakuErc20, kamonNFT, data?.address)

  // mint
  const mintPrice = 1000
  const { isMinting, mint } = useMintWithHenkaku(kamonNFT, tokenURI, mintPrice)
  const mintWithHenkaku = useCallback(async () => {
    const data = await mint()
    if (data) {
      setHasNFT(true)
    }
  }, [mint, setHasNFT])
  const { balanceOf } = useBalanceOf(kamonNFT, data?.address)
  const { totalSupply } = useTotalSupply(kamonNFT)

  useEffect(() => {
    setHasNFT(balanceOf?.gte(1) > 0)
  }, [balanceOf, data?.address])

  if (mounted && isConnected && approved && !hasNFT && !tokenURI) {
    return (
      <GenerateImageForm
        onSetTokenURI={setTokenURI}
        onSetTokenImageURI={setTokenImageURI}
        address={data?.address}
      />
    )
  }

  if (mounted && isConnected && !approved && !hasNFT) {
    return (
      <Layout>
        <ApproveForKamon erc20={henkakuErc20} spender={kamonNFT} />
      </Layout>
    )
  }

  return (
    <>
      <Layout>
        <Heading as="h2" color="white.600">
          {t('MINT_YOUR_KAMON_HEADING')}{' '}
        </Heading>
        <Text m="1rem">{t('MINT_YOUR_KAMON_EXPLANATION')}</Text>
        <SimpleGrid
          columns={{ sm: 1, md: 1, lg: 2 }}
          spacing={5}
          color="gray.600"
        >
          <div>
            {isConnected && tokenURIImage && (
              <PreviewNFTImage imageUrl={tokenURIImage} />
            )}
            {!isConnected && (
              <>
                <Text mb="1rem">
                  {t('MINT_YOUR_KAMON_WALLET_INSTRUCTION')}
                </Text>
                <Button colorScheme="teal" onClick={() => connect(metaMask)}>
                  {t('CONNECT_WALLET_BUTTON')}
                </Button>
              </>
            )}
          </div>

          <div>
            {isConnected && hasNFT && (
              <>
                <Center>
                  <Heading mt={50} size="lg">
                    {t('MINT_YOUR_KAMON_MINTED')}
                  </Heading>
                </Center>
                <Center mt={5}>
                  <Link
                    href={`${openSeaTokenBaseUrl}${totalSupply}`}
                    isExternal
                  >
                    {t('MINT_YOUR_KAMON_OPENSEA_INSTRUCTION')}
                    <ExternalLinkIcon mx="2px" />
                  </Link>
                </Center>
                <Center>
                  <Text>{t('MINT_YOUR_KAMON_OPENSEA_INSTRUCTION_2')}</Text>
                </Center>
              </>
            )}

            {mounted && isConnected && !hasNFT && tokenURI && approved && (
              <>
                <Text>
                  {t('MINT_YOUR_KAMON_DETAILS')}
                </Text>
                <Button
                  colorScheme="teal"
                  mt={3}
                  onClick={() => mintWithHenkaku()}
                  isLoading={isMinting}
                >
                  {t('MINT_YOUR_KAMON_MINT_BUTTON')}
                </Button>
              </>
            )}
          </div>
        </SimpleGrid>
      </Layout>
    </>
  )
}

interface GetStaticPropsOptions { locale: string }
export async function getStaticProps({ locale }: GetStaticPropsOptions) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
export default MintKamon
