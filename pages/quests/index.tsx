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
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { Layout } from '@/components/layouts/layout'
import { useMounted } from '@/hooks/useMounted'
import { useKeywordSubmit } from '@/hooks/quest/useKeywordSubmit'
import { useUpdateToken } from '@/hooks/quest/useUpdateToken'
import { useHasNFT } from '@/hooks/useHasNFT'
import { useBalanceOf } from '@/hooks/useBalanceOf'
import { useTokenIdOf } from '@/hooks/useTokenIdOf'
import { useTokenURI } from '@/hooks/useTokenURI'
import { getContractAddress } from '@/utils/contractAddress'
import { useIpfsSubmit, KamonToken } from '@/hooks/useIpfsSubmit'
import { useToast } from '@/hooks/useToast'
import { useIpfsGet } from '@/hooks/useIpfsGet'

const Quests: NextPage = () => {
  const { t } = useTranslation('common')
  const { toast } = useToast()
  const mounted = useMounted()
  const { connect, connectors } = useConnect()
  const [metaMask] = connectors
  const { data } = useAccount()
  const { keyword, inputChange, submit, isSubmitting, keywordSubmitSucceeded } = useKeywordSubmit()
  const { hasNFT } = useHasNFT()
  const { activeChain } = useNetwork()
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: activeChain?.id
  })
  const { balanceOf } = useBalanceOf(kamonNFT, data?.address)
  const { tokenIdOf } = useTokenIdOf(kamonNFT, data?.address)
  const { tokenURI } = useTokenURI(kamonNFT, tokenIdOf?.toNumber() || 0)
  const [tokenId, setTokenId] = useState<BigInt>(BigInt(0))
  const [tokenJSON, setTokenJSON] = useState<KamonToken>()
  const [finalTokenUri, setFinalTokenUri] = useState('')
  const [newTokenImageURI, setNewTokenImageURI] = useState('')
  const [newTokenJSON, setNewTokenJSON] = useState<KamonToken>()
  const [updateTxFailed, setUpdateTxFailed] = useState<boolean>()

  const { ipfsSubmit, ipfsSubmitSucceeded, ipfsSubmitIsSubmitting } = useIpfsSubmit()
  const { ipfsGet, ipfsGetIsSubmitting } = useIpfsGet()
  const { updateToken, updateTokenSucceeded, updateTokenIsSubmitting } = useUpdateToken(
    kamonNFT,
    tokenId,
    finalTokenUri,
  )
  const submittingSomething = () => {
    return isSubmitting || ipfsSubmitIsSubmitting || ipfsGetIsSubmitting || updateTokenIsSubmitting
  }
  useEffect(() => {
    if (tokenURI) {
      const fetchData = async () => {
        const pinataRequest = await fetch(tokenURI.toString())
        const responseJson = await pinataRequest.json()
        setTokenJSON(responseJson)
      }
      fetchData()
    }
  }, [tokenURI])

  useEffect(() => {
    if (keywordSubmitSucceeded && !ipfsSubmitIsSubmitting
      && ipfsSubmitSucceeded == undefined
    ) {
      if (data?.address == undefined || tokenJSON == undefined) return
      const userAddress: string = data?.address
      const ipfsSubmitWrapper = async () => {
        const ipfsSubmitRet = await ipfsSubmit(tokenJSON, userAddress)
        if (ipfsSubmitRet !== 'error' && ipfsSubmitRet !== 'same_points') {
          const tempFinalTokenUri = await ipfsSubmitRet
          setFinalTokenUri(tempFinalTokenUri)
        }
      }
      setUpdateTxFailed(false)
      ipfsSubmitWrapper()
    }
  }, [keywordSubmitSucceeded, data?.address, tokenJSON, ipfsSubmit, ipfsSubmitIsSubmitting, ipfsSubmitSucceeded])

  useEffect(() => {
    if (finalTokenUri && !ipfsGetIsSubmitting && newTokenJSON == undefined) {
      const getNewToken = async () => {
        const ipfsGetRet = await ipfsGet(finalTokenUri)
        if (ipfsGetRet == 'error') {
          return
        }
        setNewTokenJSON(ipfsGetRet)
        const theTokenId = tokenIdOf? tokenIdOf: BigInt(0)
        if(theTokenId == BigInt(0)) { return }
        setTokenId(BigInt(parseInt(theTokenId.toString())))
        setNewTokenImageURI(ipfsGetRet.image)
      }
      getNewToken()
    }
  }, [newTokenJSON, finalTokenUri, ipfsGet, ipfsGetIsSubmitting, tokenIdOf])

  useEffect(() => {
    if (
      newTokenImageURI && !updateTxFailed
      && updateTokenIsSubmitting !== true && updateTokenSucceeded !== true
    ) {
      const updateTokenWrapper = async () => {
        setUpdateTxFailed(!(await updateToken()))
      }
      updateTokenWrapper()
    }
  }, [updateToken, updateTxFailed, updateTokenIsSubmitting, newTokenImageURI, updateTokenSucceeded])

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
                    disabled={updateTxFailed}
                  />

                  <Button
                    mt={10}
                    w="100%"
                    colorScheme="teal"
                    onClick={() => submit()}
                    isLoading={submittingSomething()}
                    loadingText={t('BUTTON_SUBMITTING')}
                    disabled={keyword == '' || submittingSomething() || updateTxFailed}
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
      </Layout>
    </>
  )
}

export default Quests
