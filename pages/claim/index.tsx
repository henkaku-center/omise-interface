import { NextPage } from 'next'
import { useMounted } from '@/hooks/useMounted'
import { useAccount, useConnect } from 'wagmi'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Layout } from '@/components/layouts/layout'
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Spacer,
  Text
} from '@chakra-ui/react'
import { useClaim } from '@/hooks/claim/useClaim'
import { useGetClaimableToken } from '@/hooks/claim/useGetClaimableToken'
import { useHasNFT } from '@/hooks/useHasNFT'
import Link from 'next/link'
import { ethers } from 'ethers'
import { useCallback } from 'react'

const Claim: NextPage = () => {
  const { t } = useTranslation('common')
  const mounted = useMounted()
  const { connect, connectors } = useConnect()
  const [metaMask] = connectors
  const { data } = useAccount()
  const { claim, isClaiming } = useClaim()
  const { claimableToken, refetchClaimableToken } = useGetClaimableToken()
  const { hasNFT } = useHasNFT()

  const handleClaim = useCallback(async () => {
    claim()
    await refetchClaimableToken()
  }, [claim, refetchClaimableToken, claimableToken]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Layout>
        <Heading mt={50}>{t('CLAIM_HEADING')}</Heading>
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
                {hasNFT ? t('CLAIM_EXPLANATION_HEADING') : t('CLAIM_EXPLANATION_HEADING_NO_NFT')}
              </Heading>
              <Text>
                {hasNFT
                  ? t('CLAIM_EXPLANATION_BODY')
                  : t('CLAIM_EXPLANATION_BODY_NO_NFT')}
              </Text>
              {hasNFT && claimableToken != undefined ? (
                <Text>
                  {claimableToken == BigInt(0)
                    ? t('CLAIM_CLAIMABLE_AMOUNT_0')
                    : t('CLAIM_CLAIMABLE_AMOUNT_1') + ethers.utils.formatEther(claimableToken) + t('CLAIM_CLAIMABLE_AMOUNT_2')}
                </Text>
              ) : null}
            </Box>
            {mounted && !data?.address ? (
              <Button
                mt={10}
                w="100%"
                colorScheme="teal"
                onClick={() => connect(metaMask)}
              >
                {t('CONNECT_WALLET_BUTTON')}
              </Button>
            ) : hasNFT ? (
              <Button
                mt={10}
                w="100%"
                colorScheme="teal"
                onClick={handleClaim}
                isLoading={isClaiming}
                loadingText="claiming..."
                disabled={claimableToken == BigInt(0)}
              >
                {t('CLAIM_SUBMIT_BUTTON')}
              </Button>
            ) : (
              <Link href="/" passHref>
                <Button mt={10} w="100%" colorScheme="teal">
                  {t('MINT_YOUR_KAMON_BUTTON')}
                </Button>
              </Link>
            )}
          </Flex>
          <Spacer />
          <Box p={10} mx={'auto'} minW={200} order={{ base: 1, sm: 2 }}>
            <Image src="/henkaku-token.png" alt={t('DOLLAR_HENKAKU')} />
          </Box>
        </Flex>
      </Layout>
    </>
  )
}

interface GetStaticPropsOptions {
  locale: string
}
export async function getStaticProps({ locale }: GetStaticPropsOptions) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  }
}

export default Claim
