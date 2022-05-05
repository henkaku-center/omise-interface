import type { NextPage } from 'next'
import { useAccount, useNetwork, useConnect } from 'wagmi'
import { Button, Heading, Link, Center } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useCallback, useEffect, useState } from 'react'
import { Layout } from '@/components/layouts/layout'
import { GenerateImageForm } from '@/components/mintKamon/GenerateImageForm'
import { useMounted } from '@/hooks/useMounted'
import {
  APPROVE_CALLBACK_STATUS,
  useApproval,
  useApprove
} from '@/hooks/useApproval'
import { getContractAddress } from 'utils/contractAddress'
import { useMintWithHenkaku } from '@/hooks/useMintWithHenkaku'
import { useBalanceOf } from '@/hooks/useBalanceOf'
import { useTotalSupply } from '@/hooks/useTotalSupply'

const MintKamon: NextPage = () => {
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
  const openSeaTokenBaseUrl = `https://testnets.opensea.io/assets/${kamonNFT}/`

  // useState
  const [tokenURI, setTokenURI] = useState('')
  const [hasNFT, setHasNFT] = useState(false)

  /// connect
  const { connect, connectors, error } = useConnect()
  const [metaMask] = connectors

  // approve
  const { status, approve } = useApprove(henkakuErc20, kamonNFT)
  const approved = useApproval(henkakuErc20, kamonNFT)

  // mint
  const mintPrice = 1000
  const { isMinting, mint } = useMintWithHenkaku(tokenURI, mintPrice)
  const mintWithHenkaku = useCallback(async () => {
    const data = await mint()
    if (data) {
      setHasNFT(true)
    }
  }, [mint, setHasNFT])
  const { balanceOf } = useBalanceOf(data?.address)
  const { totalSupply } = useTotalSupply()

  useEffect(() => {
    setTokenURI('httsp://yourtokenURI') // TODO: for enable and mintWithHenkaku method
    setHasNFT(balanceOf && Number(balanceOf.toString()) > 0 ? true : false)
  }, [])

  if (false && !tokenURI) {
    return <GenerateImageForm />
  }

  return (
    <>
      <Layout>
        <Heading mt={50}>Henkaku kamon nft</Heading>
        {error && <div>{error.message}</div>}
        {mounted && data?.address}

        {mounted && !data?.address && (
          <Button colorScheme="teal" onClick={() => connect(metaMask)}>
            connect wallet
          </Button>
        )}

        {hasNFT && (
          <>
            <Heading mt={50} size="2xl">
              🎉 Your nft is minted !! 🎉
            </Heading>
            <Center mt={5}>
              <Link href={`${openSeaTokenBaseUrl}${totalSupply}`} isExternal>
                Check with OpenSea <ExternalLinkIcon mx="2px" />
              </Link>
            </Center>
          </>
        )}

        {mounted &&
          data?.address &&
          !hasNFT &&
          (tokenURI && approved ? (
            <Button
              mt={10}
              colorScheme="teal"
              onClick={() => mintWithHenkaku()}
              isLoading={isMinting}
            >
              Mint with 1000 henkaku
            </Button>
          ) : (
            <Button
              mt={10}
              colorScheme="teal"
              onClick={approve}
              isLoading={status == APPROVE_CALLBACK_STATUS.PENDING}
            >
              enable to get kamon nft
            </Button>
          ))}
      </Layout>
    </>
  )
}

export default MintKamon
