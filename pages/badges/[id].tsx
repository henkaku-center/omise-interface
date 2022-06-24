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
import { BigNumber, ethers } from 'ethers'
import { defaultChainID, getContractAddress } from '@/utils/contractAddress'
import { useAccount, useConnect, useNetwork } from 'wagmi'
import { Approve } from '@/components/metaMask/Approve'
import { useApproval } from '@/hooks/useApproval'
import { useMintBadge } from '@/hooks/badge/useMintBadge'
import { useBadgeBalanceOf } from '@/hooks/badge/useBalanceOf'
import { ConnectMetaMask } from '@/components/metaMask/Connect'

const displayValue = (number: BigNumber) => {
  return number.div(BigNumber.from(10).pow(18)).toString()
}

const Badge = () => {
  const router = useRouter()
  const { id } = router.query
  const tokenID = parseInt(id as string)
  const { activeChain } = useNetwork()
  const { badge } = useBadge(tokenID)
  const { t } = useTranslation('badge')
  const { data } = useAccount()
  const { tokenURIJSON } = useFetchTokenURIJSON(badge?.tokenURI)
  const henkakuErc20 = getContractAddress({
    name: 'henkakuErc20',
    chainId: activeChain?.id
  })
  const henkakuBadge = getContractAddress({
    name: 'henkakuBadge',
    chainId: activeChain?.id
  })
  const approved = useApproval(henkakuErc20, henkakuBadge, data?.address)
  const { isMinting, mint } = useMintBadge(tokenID)
  const { balanceOf, hasNft } = useBadgeBalanceOf(data?.address, tokenID)
  const { isConnected } = useConnect()

  if (!isConnected) {
    return (
      <>
        <Layout>
          <Heading as="h2" color="white.600">
            {t('title.connectWallet')}
          </Heading>
          <ConnectMetaMask style={{with: '60%'}}>{t('connectWallet')}</ConnectMetaMask>
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
        <SimpleGrid
          columns={{ sm: 1, md: 1, lg: 2 }}
          spacing={5}
          color="gray.600"
        >
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
                {hasNft && t('title.minted')}
                {!badge?.mintable && !hasNft && t('title.notMintable')}
                {badge?.mintable && badge?.amount.gt(0) && !hasNft && (
                  <>
                    {t('title.mintable')} {displayValue(badge.amount)} $henkaku
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
                {badge?.mintable && badge?.amount.eq(0) && !hasNft && (
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
