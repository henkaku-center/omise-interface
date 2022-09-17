import { Layout } from '@/components/layouts/layout'
import {
  Heading,
  Text,
  SimpleGrid,
  Center,
  Link,
  Button
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { useBadge } from '@/hooks/badge/useBadge'
import { useFetchTokenURIJSON } from '@/hooks/badge/useFetchMetaData'
import { NFTImage } from '@/components/NFTImage'
import { displayValue } from '@/utils/bigNumber'
import { defaultChainID, getContractAddress } from '@/utils/contractAddress'
import { useAccount, useConnect, useNetwork } from 'wagmi'
import { Approve } from '@/components/metaMask/Approve'
import { useApproval } from '@/hooks/useApproval'
import { useMintBadge } from '@/hooks/badge/useMintBadge'
import { useBadgeBalanceOf } from '@/hooks/badge/useBalanceOf'
import { ConnectMetaMask } from '@/components/metaMask/Connect'
import { useEffect, useState } from 'react'

const Badge = () => {
  const router = useRouter()
  const { id } = router.query
  const tokenID = parseInt(id as string)
  const { activeChain } = useNetwork()
  const { t } = useTranslation('badge')
  const { data } = useAccount()
  const henkakuErc20 = getContractAddress({
    name: 'henkakuErc20',
    chainId: activeChain?.id
  })
  const henkakuBadge = getContractAddress({
    name: 'henkakuBadge',
    chainId: activeChain?.id
  })
  const { badge } = useBadge(henkakuBadge, tokenID)
  const { tokenURIJSON } = useFetchTokenURIJSON(badge?.tokenURI)
  const approved = useApproval(henkakuErc20, henkakuBadge, data?.address)
  const { isMinting, mint } = useMintBadge(henkakuBadge, data?.address, tokenID)
  const { balanceOf, hasNft } = useBadgeBalanceOf(
    henkakuBadge,
    data?.address,
    tokenID
  )

  const [minted, setMinted] = useState(false)
  const [noMintable, setNoMintable] = useState(false)
  const [mintable, setMintable] = useState(false)
  const [freeMintable, setFreeMintable] = useState(false)

  useEffect(() => {
    setMinted(hasNft)
    setNoMintable(!badge?.mintable && !hasNft)
    setMintable(!!badge?.mintable && badge?.amount.gt(0) && !hasNft)
    setFreeMintable(!!badge?.mintable && badge?.amount.eq(0) && !hasNft)
  }, [badge?.amount, badge?.mintable, hasNft])

  const { isDisconnected } = useConnect()
  if (isDisconnected) {
    return (
      <>
        <Layout>
          <Heading as="h2" color="white.600">
            {t('title.connectWallet')}
          </Heading>
          <ConnectMetaMask style={{ with: '60%' }}>
            {t('connectWallet')}
          </ConnectMetaMask>
        </Layout>
      </>
    )
  }

  return (
    <>
      <Layout>
        <Heading as="h2" color="white.600">
          {tokenURIJSON?.name}
        </Heading>
        <SimpleGrid columns={{ sm: 1, md: 1, lg: 2 }} spacing={5}>
          <div>
            {tokenURIJSON?.image && <NFTImage imageUrl={tokenURIJSON?.image} />}
            <Text m="1rem">{tokenURIJSON?.description}</Text>
          </div>
          <div>
            <Center>
              <Heading mt={50} size="lg">
                {tokenURIJSON?.name}
              </Heading>
            </Center>
            <Center mt={5}></Center>
            <Center>
              <Text>
                {minted && t('title.minted')}
                {noMintable && t('title.notMintable')}
                {mintable && (
                  <>
                    {t('title.mintable')} {badge && displayValue(badge.amount)}{' '}
                    $HENKAKU
                    {approved ? (
                      <Button
                        width="90%"
                        onClick={() => mint()}
                        colorScheme="teal"
                        mt={2}
                        loadingText="minting..."
                        isLoading={isMinting}
                      >
                        {t('mint')}
                      </Button>
                    ) : (
                      <Approve
                        erc20={henkakuErc20}
                        spender={henkakuBadge}
                        style={{ width: '90%' }}
                      >
                        {t('approve')}
                      </Approve>
                    )}
                  </>
                )}

                {freeMintable && (
                  <>
                    {t('title.freeMintable')}
                    <Text>
                      <Button
                        width="90%"
                        onClick={() => mint()}
                        colorScheme="teal"
                        mt={2}
                        loadingText="minting..."
                        isLoading={isMinting}
                      >
                        {t('mint')}
                      </Button>
                    </Text>
                  </>
                )}
              </Text>
            </Center>
          </div>
        </SimpleGrid>
      </Layout>
    </>
  )
}

export default Badge
