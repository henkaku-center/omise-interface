import type { NextPage } from 'next'
import {
  Text,
  Heading,
  Image,
  Box,
  Button,
  Input,
  Stack
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useAccount, useConnect, useNetwork } from 'wagmi'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { Layout } from '@/components/layouts/layout'
import { useMounted } from '@/hooks/useMounted'
import { useKeywordSubmit } from '@/hooks/quest/useKeywordSubmit'
import { useHasNFT } from '@/hooks/useHasNFT'
import { useBalanceOf } from '@/hooks/useBalanceOf'
import { useTokenIdOf } from '@/hooks/useTokenIdOf'
import { useTokenURI } from '@/hooks/useTokenURI'
import { getContractAddress } from '@/utils/contractAddress'

const Quests: NextPage = () => {
  const { t } = useTranslation('common')
  const mounted = useMounted()
  const { connect, connectors } = useConnect()
  const [metaMask] = connectors
  const { data } = useAccount()
  const { keyword, inputChange, submit, isSubmitting } = useKeywordSubmit()
  const { hasNFT } = useHasNFT()
  const { activeChain } = useNetwork()
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: activeChain?.id
  })
  const { balanceOf } = useBalanceOf(kamonNFT, data?.address)
  const { tokenIdOf } = useTokenIdOf(kamonNFT, data?.address)
  const { tokenURI } = useTokenURI(kamonNFT, tokenIdOf?.toNumber() || 0)
  const [tokenURIImage, setTokenImageURI] = useState('')
  const [tokenJSON, setTokenJSON] = useState('')

  useEffect(() => {
    if (balanceOf && tokenIdOf && tokenURI) {
      const fetchData = async () => {
        const pinataRequest = await fetch(tokenURI.toString())
        const responseJson = await pinataRequest.json()

        setTokenImageURI(responseJson.image)
        setTokenJSON(responseJson)
      }

      fetchData()
    }
  }, [balanceOf, tokenIdOf, tokenURI])

  return (
    <>
      <Layout>
        <Heading mt={50}>{t('QUEST.HEADING')}</Heading>
        <Box display={{ md: 'flex', xl: 'flex' }}>
          <Box p={2} minW={300}>
            <Image
              src="/joi-ito-henkaku-podcast.png"
              alt="{t('QUEST.IMAGE_ALT')}"
            />
          </Box>
          <Box p={2}>
            <Box w="100%" p={4}>
              {hasNFT ? (
                <>
                  <Heading size="md">{t('QUEST.EXPLANATION_HEADING')}</Heading>
                  <Text>{t('QUEST.EXPLANATION_BODY')}</Text>
                </>
              ) : (
                <>
                  <Heading size="md">
                    {t('QUEST.MINT_YOUR_KAMON_HEADING')}
                  </Heading>
                  <Text>{t('QUEST.MINT_YOUR_KAMON_EXPLANATION')}</Text>
                </>
              )}
            </Box>

            {mounted && !data?.address && !hasNFT ? (
              <Button
                mt={10}
                w="100%"
                colorScheme="teal"
                onClick={() => connect(metaMask)}
              >
                {t('CONNECT_WALLET_BUTTON')}
              </Button>
            ) : hasNFT ? (
              <Box mt={4}>
                <Stack>
                  <Input
                    placeholder={t('QUEST.INPUT_PLACEHOLDER')}
                    onChange={inputChange}
                    textTransform="uppercase"
                  />

                  <Button
                    mt={10}
                    w="100%"
                    colorScheme="teal"
                    onClick={() => submit()}
                    isLoading={isSubmitting}
                    loadingText={t('BUTTON_SUBMITTING')}
                    disabled={keyword == ''}
                  >
                    {t('QUEST.SUBMIT_BUTTON')}
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Link href="/" passHref>
                <Button mt={10} w="100%" colorScheme="teal">
                  {t('QUEST.MINT_BUTTON')}
                </Button>
              </Link>
            )}
          </Box>
        </Box>
        {mounted && tokenIdOf?.gt(0) && tokenURIImage ? (
          <>
            <Text>Debug</Text>
            <Image src={tokenURIImage} alt="" />
            <Text>{JSON.stringify(tokenJSON)}</Text>
          </>
        ) : (<></>)}
      </Layout>
    </>
  )
}

export default Quests
