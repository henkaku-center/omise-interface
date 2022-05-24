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
import axios from 'axios'
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
import { useGetPoint } from '@/hooks/quest/useGetPoint'

interface TokenAttribute {
  display_type: string | undefined
  trait_type: string
  value: number | string
}
interface KamonToken {
  name: string
  description: string
  image: string
  attributes: TokenAttribute[]
}

const Quests: NextPage = () => {
  const { t } = useTranslation('common')
  const ipfsApiEndpoint = process.env.NEXT_PUBLIC_IPFS_API_URI + ''
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
  const { point, refetchPoint } = useGetPoint()
  const [tokenURIImage, setTokenImageURI] = useState('')
  const [tokenJSON, setTokenJSON] = useState<KamonToken>()
  const [newTokenURI, setNewTokenURI] = useState('')
  const [newTokenImageURI, setNewTokenImageURI] = useState('')
  const [newTokenJSON, setNewTokenJSON] = useState<KamonToken>()
  const [stillProcessingSomething, setStillProcessingSomething] = useState(false)
  const [readyToRequestIpfs, setReadyToRequestIpfs] = useState(false)
  const [hasSubmittedQuest, setHasSubmittedQuest] = useState(false)

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

  useEffect(() => {
    if (isSubmitting == true) {
      setStillProcessingSomething(true)
      setHasSubmittedQuest(true)
    } else if (hasSubmittedQuest) {
      setReadyToRequestIpfs(true)
    }
  }, [isSubmitting, hasSubmittedQuest])

  useEffect(() => {
    if (readyToRequestIpfs == true) {
      const hitIpfsAip = async () => {
        console.log('hitIpfsAip')
        let dateFromToken = 0
        let rolesFromToken: string[] = []
        console.log(await refetchPoint())
        let points: number = 0
        if (point !== undefined) {
          points = parseInt(point?.toString())
          console.log('points:', points)
        } else {
          console.log('points undefined:', points)
        }
        console.log(tokenJSON)
        tokenJSON?.attributes.forEach((attr: TokenAttribute) => {
          if (attr.trait_type == 'Date') {
            dateFromToken = parseInt(attr.value.toString())
          } else if (attr.trait_type == 'Role') {
            rolesFromToken.push(attr.value.toString())
          }
        })
        const payload = {
          address: data?.address,
          roles: rolesFromToken,
          points: points,
          date: dateFromToken,
        }
        console.log(payload)
    
        const ipfsRequest = await axios.post(ipfsApiEndpoint, payload, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        setNewTokenURI(await ipfsRequest.data.tokenUri)
        console.log('ipfsRequest status', ipfsRequest.status)
        console.log('newTokenURI', newTokenURI)
        const newTokenRequest = await axios.get(newTokenURI)
        setNewTokenJSON(newTokenRequest.data)
        console.log('newTokenRequest status', newTokenRequest.status)
        console.log('newTokenJSON', newTokenJSON)
        if(newTokenJSON !== undefined) {
          setNewTokenImageURI(newTokenJSON.image)
          console.log('newTokenImageURI', newTokenImageURI)
        }
        setStillProcessingSomething(false)
      }
      setHasSubmittedQuest(false)
      setReadyToRequestIpfs(false)
      setStillProcessingSomething(true)
      hitIpfsAip()
    }
  }, [readyToRequestIpfs, data?.address, point, tokenJSON, ipfsApiEndpoint, refetchPoint, newTokenImageURI, newTokenJSON, newTokenURI])

  const submitForm = () => {
    setStillProcessingSomething(true)
    submit()
  }

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
                    onClick={() => submitForm()}
                    isLoading={stillProcessingSomething}
                    loadingText={t('BUTTON_SUBMITTING')}
                    disabled={keyword == '' || stillProcessingSomething}
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
            <Text>process.env.production: <>{process.env.production ? 'polygon' : 'goerli'}</></Text>
            <Text>point: <>{point && point>0? point.toString(): 0}</></Text>
            <Text>isSubmitting: {isSubmitting? '✅': '❌'}</Text>
            <Text>hasSubmittedQuest: {hasSubmittedQuest? '✅': '❌'}</Text>
            <Text>readyToRequestIpfs: {readyToRequestIpfs? '✅': '❌'}</Text>
            <Text>newTokenURI: {newTokenURI? newTokenURI: '❓'}</Text>
            <Text>newTokenJSON: {newTokenJSON? JSON.stringify(newTokenJSON): '❓'}</Text>
            <Text>newTokenImageURI: {newTokenImageURI? newTokenImageURI: '❓'}</Text>
            <Text>stillProcessingSomething: {stillProcessingSomething? '✅': '❌'}</Text>
            <Text>{ipfsApiEndpoint}</Text>
            <Text>{JSON.stringify(tokenJSON)}</Text>
            <Image src={tokenURIImage} alt="" />
          </>
        ) : (<></>)}
      </Layout>
    </>
  )
}

export default Quests
