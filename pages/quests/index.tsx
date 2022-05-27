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
import { useUpdateOwnNFT } from '@/hooks/useUpdateOwnNFT'

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
  const [tokenImageURI, setTokenImageURI] = useState('')
  const [tokenId, setTokenId] = useState(0)
  const [tokenJSON, setTokenJSON] = useState<KamonToken>()
  const [finalTokenUri, setFinalTokenUri] = useState('')
  const [newTokenImageURI, setNewTokenImageURI] = useState('')
  const [newTokenJSON, setNewTokenJSON] = useState<KamonToken>()
  const [stillProcessingSomething, setStillProcessingSomething] = useState(false)
  const [questSubmitted, setQuestSubmitted] = useState(false)
  const [questReturned, setQuestReturned] = useState(false)
  const [ipfsSubmitted, setIpfsSubmitted] = useState(false)
  const [ipfsReturned, setIpfsReturned] = useState(false)
  const [newTokenRequestSubmitted, setNewTokenRequestSubmitted] = useState(false)
  const [newTokenRequestReturned, setNewTokenRequestReturned] = useState(false)

  const { update, isError } = useUpdateOwnNFT(
    kamonNFT,
    tokenId,
    finalTokenUri,
  )

  const resetFlags = () => {
    setStillProcessingSomething(false)
    setQuestSubmitted(false)
    setQuestReturned(false)
    setIpfsSubmitted(false)
    setIpfsReturned(false)
    setNewTokenRequestSubmitted(false)
    setNewTokenRequestReturned(false)
  }

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

  // Manage when the quest starts and finishes submitting
  useEffect(() => {
    if (isSubmitting == true) {
      resetFlags()
      setFinalTokenUri('')
      setNewTokenImageURI('')
      setStillProcessingSomething(true)
      setQuestSubmitted(true)
    } else if (questSubmitted) {
      setQuestReturned(true)
    }
  }, [isSubmitting, questSubmitted])

  // Manage the IPFS request after the quest returns
  useEffect(() => {
    if (questReturned == true && ipfsSubmitted == false && finalTokenUri == '') {
      const hitIpfsApi = async () => {
        setIpfsSubmitted(true)
        let dateFromToken = 0
        let rolesFromToken: string[] = []
        const onTokenPointsAttr: TokenAttribute | undefined = tokenJSON?.attributes.find(elem => elem.trait_type == 'Points')
        const onTokenPoints = onTokenPointsAttr?.value
        // console.log('point value on token', onTokenPoints)
        const updatedPointsQuery = await refetchPoint()
        const updatedPoints = Array.isArray(updatedPointsQuery.data)? updatedPointsQuery.data[0]: 0
        const updatedPointsInt = parseInt(updatedPoints.toString())
        // console.log('new point value', updatedPointsInt)
        if(onTokenPoints == updatedPointsInt) {
          console.log('💀 No need to update the NFT')
          resetFlags()
          setFinalTokenUri('')
          setNewTokenImageURI('')
          return // Comment for debugging
        }
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
          points: updatedPointsInt,
          date: dateFromToken,
        }
        console.log('payload', payload)
    
        const ipfsRequest = await axios.post(ipfsApiEndpoint, payload, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        setIpfsReturned(true)
        const TempfinalTokenUri = await ipfsRequest.data.tokenUri
        setFinalTokenUri(TempfinalTokenUri)
        console.log('ipfsRequest status', ipfsRequest.status)
        console.log('finalTokenUri', TempfinalTokenUri)
      }
      hitIpfsApi()
    }
  }, [questReturned, data?.address, point, tokenJSON, ipfsApiEndpoint, refetchPoint, finalTokenUri, ipfsSubmitted])

  // Manage the new token request after the quest returns
  useEffect(() => {
    if (ipfsReturned == true && newTokenRequestSubmitted == false && newTokenJSON == undefined) {
      const getNewToken = async () => {
        setNewTokenRequestSubmitted(true)
        const newTokenRequest = await axios.get(finalTokenUri)
        setNewTokenJSON(newTokenRequest.data)
        console.log('newTokenRequest status', newTokenRequest.status)
        setNewTokenRequestReturned(true)
      }
      getNewToken()
    }
  }, [newTokenJSON, finalTokenUri, ipfsReturned, newTokenRequestSubmitted])

  // Get the new token image URI from the updated token
  useEffect(() => {
    if (newTokenRequestReturned == true) {
      console.log('newTokenJSON', newTokenJSON)
      if(newTokenJSON !== undefined) {
        console.log('newTokenImageURI', newTokenJSON.image)
        setNewTokenImageURI(newTokenJSON.image)
      }
    }
    resetFlags()
  }, [newTokenRequestReturned, newTokenJSON, newTokenImageURI])

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
        {mounted && tokenIdOf?.gt(0) && tokenImageURI ? (
          <>
            <Text>Debug</Text>
            <Text>point: <>{point && point>0? point.toString(): 0}</></Text>
            <Text>{isSubmitting? '✅': '❌'} isSubmitting</Text>
            <Text>{questSubmitted? '✅': '❌'} questSubmitted</Text>
            <Text>{questReturned? '✅': '❌'} questReturned</Text>
            <Text>{ipfsSubmitted? '✅': '❌'} ipfsSubmitted</Text>
            <Text>{ipfsReturned? '✅': '❌'} ipfsReturned</Text>
            <Text>{newTokenRequestSubmitted? '✅': '❌'} newTokenRequestSubmitted</Text>
            <Text>{newTokenRequestReturned? '✅': '❌'} newTokenRequestReturned</Text>
            <Text>{finalTokenUri? '✅': '❓'} finalTokenUri</Text>
            <Text>{newTokenImageURI? '✅': '❓'} newTokenImageURI</Text>
            <Text>{stillProcessingSomething? '✅': '❌'} stillProcessingSomething</Text>
            {/* <Text>{ipfsApiEndpoint}</Text> */}
            {/* <Text>{JSON.stringify(tokenJSON)}</Text> */}
            <Stack direction='row'>
              <Image src={tokenImageURI} alt="" boxSize='300px' />
              {newTokenImageURI !== ''? <Image src={newTokenImageURI} alt="" boxSize='300px' />: <></>}
            </Stack>
            <Text>newTokenJSON: {newTokenJSON? JSON.stringify(newTokenJSON): '❓'}</Text>
          </>
        ) : (<></>)}
      </Layout>
    </>
  )
}

export default Quests
