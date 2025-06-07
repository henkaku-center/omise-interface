import type { NextPage } from 'next'

import { Layout } from '@/components/layouts/layout'
import { SimpleGrid, Heading } from '@chakra-ui/react'
import { useNetwork, useConnect } from 'wagmi'
import { getContractAddress } from '@/utils/contractAddress'
import { useBadges, BadgeElement } from '@/hooks/badge/useBadges'
import { useEffect, useState } from 'react'
import { BadgeBox } from '@/components/badges/BadgeBox'
import { ConnectMetaMask } from '@/components/metaMask/Connect'
import useTranslation from 'next-translate/useTranslation'
import { ethers } from 'ethers'

type BadgeItem = {
  tokenId: number
  mintable: boolean
  transferable: boolean
  amount: ethers.BigNumber
  maxSupply: ethers.BigNumber
  tokenURI: string
}

const Badges: NextPage = () => {
  const { t } = useTranslation('badge')
  const { chain } = useNetwork()
  const henkakuBadge = getContractAddress({
    name: 'dalabsWSBadge',
    chainId: chain?.id
  })
  const { badges } = useBadges(henkakuBadge)
  const [badgeList, setBadgeList] = useState<BadgeItem[]>([])

  useEffect(() => {
    const badgeArray = badges?.map((badge) => {
      const [tokenId, mintable, transferable, amount, maxSupply, tokenURI] =
        badge
      return {
        tokenId,
        mintable,
        transferable,
        amount,
        maxSupply,
        tokenURI
      }
    })
    setBadgeList(badgeArray as BadgeItem[])
  }, [badges])

  const { isConnected } = useConnect()

  if (!isConnected) {
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
    <Layout>
      <SimpleGrid
        columns={{ sm: 2, md: 4 }}
        spacing="8"
        p="10"
        textAlign="center"
        rounded="lg"
      >
        {badgeList &&
          badgeList.map((data) => (
            <div key={data.tokenId}>
              <BadgeBox badge={data} contractAddress={henkakuBadge} />
            </div>
          ))}
      </SimpleGrid>
    </Layout>
  )
}

export default Badges
