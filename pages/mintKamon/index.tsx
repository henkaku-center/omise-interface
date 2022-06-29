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
import useTranslation from 'next-translate/useTranslation'
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
  const openSeaCollectionUrl = 'https://opensea.io/collection/henkaku-kamon'

  // useState
  const [tokenURI, setTokenURI] = useState('')
  const [tokenURIImage, setTokenImageURI] = useState('')

  /// connect
  const { connect, connectors, isConnected } = useConnect()
  const [metaMask] = connectors

  // approve
  const approved = useApproval(henkakuErc20, kamonNFT, data?.address)

  // mint
  const mintPrice = 1000
  const { isMinting, mint } = useMintWithHenkaku(
    kamonNFT,
    tokenURI,
    mintPrice,
    data?.address
  )
  const { balanceOf, hasNft } = useBalanceOf(kamonNFT, data?.address)

  if (mounted && isConnected && approved && !hasNft && !tokenURI) {
    return (
      <GenerateImageForm
        onSetTokenURI={setTokenURI}
        onSetTokenImageURI={setTokenImageURI}
        address={data?.address}
      />
    )
  }

  if (mounted && isConnected && !approved && !hasNft) {
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
                <Text mb="1rem">{t('MINT_YOUR_KAMON_WALLET_INSTRUCTION')}</Text>
                <Button colorScheme="teal" onClick={() => connect(metaMask)}>
                  {t('CONNECT_WALLET_BUTTON')}
                </Button>
              </>
            )}
          </div>

          <div>
            {isConnected && hasNft && (
              <>
                <Center>
                  <Heading mt={50} size="lg">
                    {t('MINT_YOUR_KAMON_MINTED')}
                  </Heading>
                </Center>
                <Center mt={5}>
                  <Link href={openSeaCollectionUrl} isExternal>
                    {t('MINT_YOUR_KAMON_OPENSEA_INSTRUCTION')}
                    <ExternalLinkIcon mx="2px" />
                  </Link>
                </Center>
                <Center>
                  <Text>{t('MINT_YOUR_KAMON_OPENSEA_INSTRUCTION_2')}</Text>
                </Center>
              </>
            )}

            {mounted && isConnected && !hasNft && tokenURI && approved && (
              <>
                <Text>{t('MINT_YOUR_KAMON_DETAILS')}</Text>
                <Button
                  colorScheme="teal"
                  mt={3}
                  onClick={() => mint()}
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

export default MintKamon
