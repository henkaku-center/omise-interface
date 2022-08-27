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

const Badges: NextPage = () => {
  const { t } = useTranslation('badge')
  const { activeChain } = useNetwork()
  const henkakuBadge = getContractAddress({
    name: 'dalabsWSBadge',
    chainId: activeChain?.id
  })
  const { badges } = useBadges(henkakuBadge)
  const [badgeList, setBadgeList] = useState<BadgeElement[]>([])

  useEffect(() => {
    setBadgeList(badges as BadgeElement[])
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
          badgeList.map((data, index) => (
            <div key={index}>
              <BadgeBox
                badge={data}
                tokenId={index + 1}
                contractAddress={henkakuBadge}
                prefix='w3g'
              />
            </div>
          ))}
      </SimpleGrid>
    </Layout>
  )
}

export default Badges
