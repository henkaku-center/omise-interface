import {
  Heading,
  Text,
  SimpleGrid,
  Button,
  Box
} from '@chakra-ui/react'
import { Router, useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { useBadge } from '@/hooks/badge/useBadge'
import { useFetchTokenURIJSON } from '@/hooks/badge/useFetchMetaData'
import { NFTImage } from '@/components/NFTImage'
import { getContractAddress } from '@/utils/contractAddress'
import { chainId, useAccount, useConnect, useNetwork } from 'wagmi'
import { useApproval } from '@/hooks/useApproval'
import { useMintBadge } from '@/hooks/badge/useMintBadge'
import { useBadgeBalanceOf } from '@/hooks/badge/useBalanceOf'
import { ConnectMetaMask } from '@/components/metaMask/Connect'
import { useEffect, useState } from 'react'
import { DAlabLayout } from '@/components/layouts/dlabLayout'
import setLanguage from 'next-translate/setLanguage'
import { ArrowForwardIcon } from '@chakra-ui/icons'

const DAlabBadge = () => {
  const router = useRouter()
  const { id } = router.query
  const tokenID = parseInt(id as string)
  const { activeChain, switchNetwork } = useNetwork()
  const { t } = useTranslation('dalabws')
  const { data } = useAccount()
  const henkakuBadge = getContractAddress({
    name: 'dalabsWSBadge',
    chainId: activeChain?.id
  })
  const { badge } = useBadge(henkakuBadge, tokenID)
  const { tokenURIJSON } = useFetchTokenURIJSON(badge?.tokenURI)
  const { isMinting, mint } = useMintBadge(henkakuBadge, data?.address, tokenID)
  const { hasNft } = useBadgeBalanceOf(henkakuBadge, data?.address, tokenID)

  const [minted, setMinted] = useState(false)

  useEffect(() => {
    setLanguage('ja')
  }, [])

  useEffect(() => {
    setMinted(hasNft)
  }, [badge?.mintable, hasNft])

  const { isDisconnected } = useConnect()
  if (isDisconnected) {
    return (
      <DAlabLayout>
        <SimpleGrid columns={{ sm: 1, md: 1, lg: 2 }} spacing={5} color="white">
          <Box>
            <Heading mt={50} size="lg">
              MINT NFT
            </Heading>
            <NFTImage imageUrl={'/dalab_ws1.png'} />
          </Box>
          <Box m={5}>
            <Heading mt={50} size="lg">
              {t('notConnected.title')}
            </Heading>
            <Text mt={10}>{t('notConnected.description')}</Text>
            <Text mt={10}>
              <ConnectMetaMask style={{ with: '100%', minWidth: '300px' }}>
                {t('notConnected.button')}
              </ConnectMetaMask>
            </Text>
          </Box>
        </SimpleGrid>
      </DAlabLayout>
    )
  }

  if (!isDisconnected && activeChain?.id != chainId.polygon && activeChain?.id != chainId.goerli) {
    return (
      <DAlabLayout>
        <Heading as="h2" color="white.600">
          {t('connected.switchNetwork')}
        </Heading>
        <Text mb={5}>wallet address: {data?.address}</Text>

        {switchNetwork ? (
          <Button
            ml="1rem"
            colorScheme="teal"
            variant="outline"
            rightIcon={<ArrowForwardIcon />}
            onClick={() => {
              switchNetwork(chainId.polygon)
              Router.reload();
             }}
          >
            {t('connected.switchNetwork')}
          </Button>
        ) : (
          <p>hmmm, wait something is wrong. maybe reload</p>
        )}
      </DAlabLayout>
    )
  }
  const title = minted ? t('afterMint.title') : t('connected.title')
  const description = minted
    ? t('afterMint.description')
    : t('connected.description')

  if (!isDisconnected) {
    return (
      <DAlabLayout>
        <SimpleGrid columns={{ sm: 1, md: 1, lg: 2 }} spacing={5} color="white">
          <Box>
            <Heading mt={50} size="lg">
              MINT NFT
            </Heading>
            {tokenURIJSON?.image && <NFTImage imageUrl={tokenURIJSON?.image} />}
          </Box>
          <Box m={5}>
            <Heading mt={50} size="lg">
              {title}
            </Heading>
            <Text mt={10}>{description}</Text>
            <Text mt={10}>
              {minted ? (
                <Text>{t('afterMint.notice')}</Text>
              ) : (
                <Button
                  width="100%"
                  minWidth="300px"
                  onClick={() => mint()}
                  colorScheme="teal"
                  mt={2}
                  loadingText="minting..."
                  isLoading={isMinting}
                >
                  {t('connected.button')}
                </Button>
              )}
            </Text>
          </Box>
        </SimpleGrid>
      </DAlabLayout>
    )
  }
}

export default DAlabBadge
