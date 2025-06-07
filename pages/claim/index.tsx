import { NextPage } from 'next'
import { useMounted } from '@/hooks/useMounted'
import { useAccount, useConnect } from 'wagmi'
import useTranslation from 'next-translate/useTranslation'
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
  const { t } = useTranslation('claim')
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
        <Heading mt={50}>{t('heading.title')}</Heading>
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
                {hasNFT ? t('heading.claim') : t('heading.getKamonFirst')}
              </Heading>
              <Text>
                {hasNFT
                  ? t('info.canClaim')
                  : t('info.cannotClaim')}
              </Text>
              {hasNFT && claimableToken != undefined ? (
                <Text>
                  {claimableToken == BigInt(0)
                    ? t('info.hasNoPoints')
                    : t('info.hasThisManyPoints', {points: ethers.utils.formatEther(claimableToken)})
                  }
                </Text>
              ) : null}
            </Box>
            {mounted && !data?.address ? (
              <Button
                mt={10}
                w="100%"
                colorScheme="teal"
                onClick={() => connect({ connector: metaMask })}
              >
                {t('connectWallet')}
              </Button>
            ) : hasNFT ? (
              <Button
                mt={10}
                w="100%"
                colorScheme="teal"
                onClick={handleClaim}
                isLoading={isClaiming}
                loadingText={t('isClaiming')}
                disabled={claimableToken == BigInt(0)}
              >
                {t('claimButton')}
              </Button>
            ) : (
              <Link href="/" passHref>
                <Button mt={10} w="100%" colorScheme="teal">
                  {t('mintKamonButton')}
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
