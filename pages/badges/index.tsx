import type { NextPage } from 'next'

import { Layout } from '@/components/layouts/layout'
import { SimpleGrid, Button } from '@chakra-ui/react'
import { useNetwork } from 'wagmi'
import { getContractAddress } from '@/utils/contractAddress'
import { useBadges } from '@/hooks/badge/useBadges'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { BadgeBox } from '@/components/badges/BadgeBox'

const Badges: NextPage = () => {
  const { activeChain } = useNetwork()
  const henkakuBadge = getContractAddress({
    name: 'henkakuBadge',
    chainId: activeChain?.id
  })
  const { badges } = useBadges(henkakuBadge)
  const [badgeList, setBadgeList] = useState<[]>([])

  useEffect(() => {
    setBadgeList(badges as [])
  }, [badges])

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
              <BadgeBox badge={data} tokenId={index + 1} />
            </div>
          ))}
      </SimpleGrid>
    </Layout>
  )
}

export default Badges
