import type { NextPage } from 'next'
import { useAccount, useNetwork, useConnect } from 'wagmi'
import {
  Button,
  Heading,
  Link,
  Center,
  Text,
  SimpleGrid,
  Image
} from '@chakra-ui/react'
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
import { getContractAddress } from '@/utils/contractAddress'
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
  const { connect, connectors, error, isConnected } = useConnect()
  const [metaMask] = connectors

  // approve
  const { status, approve } = useApprove(henkakuErc20, kamonNFT)
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
    setHasNFT(!!(balanceOf && balanceOf.gte(1) > 0))
  }, [balanceOf, data?.address])

  if (mounted && isConnected && !hasNFT && !tokenURI) {
    return (
      <GenerateImageForm onSetTokenURI={setTokenURI} address={data?.address} />
    )
  }

  return (
    <>
      <Layout>
        <Heading as="h2" color="gray.600">
          Mint your Kamon - 家紋{' '}
        </Heading>
        <Text m="1rem">Kamon NFT is membership of henkaku community</Text>
        <SimpleGrid
          columns={{ sm: 1, md: 1, lg: 2 }}
          spacing="10px"
          color="gray.600"
        >
          <div>
            <Image src={tokenURI} alt="" />
            {!isConnected && (
              <>
                <Text mb="1rem">
                  To mint your Kamon NFT- 家紋 connect your wallet
                </Text>
                <Button colorScheme="teal" onClick={() => connect(metaMask)}>
                  Connect wallet
                </Button>
              </>
            )}
          </div>

          <div>
            {hasNFT && (
              <>
                <Center>
                  <Heading mt={50} size="lg">
                    🎉 Your nft is minted !! 🎉
                  </Heading>
                </Center>
                <Center mt={5}>
                  <Link
                    href={`${openSeaTokenBaseUrl}${totalSupply}`}
                    isExternal
                  >
                    Check with OpenSea <ExternalLinkIcon mx="2px" />
                  </Link>
                </Center>
                <Center>
                  <Text>It takes a little time for the NFT to appear</Text>
                </Center>
              </>
            )}

            {mounted &&
              isConnected &&
              !hasNFT &&
              (tokenURI && approved ? (
                <>
                  <Text>
                    To mint your Kamon NFT - 家紋 enable your wallet to buy
                  </Text>
                  <Text mb={2}>
                    The left image shows your Kamon NFT. It takes 2,3 min to
                    display all
                  </Text>
                  <Button
                    colorScheme="teal"
                    onClick={() => mintWithHenkaku()}
                    isLoading={isMinting}
                  >
                    Mint with 1000 henkaku
                  </Button>
                </>
              ) : (
                <>
                  <Text>
                    To mint your Kamon NFT - 家紋 enable your wallet to buy
                  </Text>
                  <Text mb={2}>
                    the left image shows your membership nft. it takes 2,3 min
                    to display all
                  </Text>
                  <Button
                    colorScheme="teal"
                    onClick={approve}
                    isLoading={status == APPROVE_CALLBACK_STATUS.PENDING}
                  >
                    Enable to get kamon nft
                  </Button>
                </>
              ))}
          </div>
        </SimpleGrid>
      </Layout>
    </>
  )
}

export default MintKamon
