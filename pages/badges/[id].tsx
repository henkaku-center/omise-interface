import { Layout } from '@/components/layouts/layout'
import { Heading, Text, SimpleGrid, Center, Link } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { useBadge } from '@/hooks/badge/useBadge'
import { useFetchTokenURIJSON } from '@/hooks/badge/useFetchMetaData'
import { NFTImage } from '@/components/NFTImage'
import { BigNumber, ethers } from 'ethers'

const displayValue = (number: BigNumber) => {
  return number.div(BigNumber.from(10).pow(18)).toString()
}

const Badge = () => {
  const router = useRouter()
  const { id } = router.query
  const { badge } = useBadge(parseInt(id as string))
  const { t } = useTranslation('badge')
  const { tokenURIJSON } = useFetchTokenURIJSON(badge?.tokenURI)
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
                {!badge?.mintable && t('title.notMintable')}
                {badge?.mintable && badge?.amount.gt(0) && (
                  <>
                    {t('title.mintable')} {displayValue(badge.amount)} $henkaku
                  </>
                )}
                {badge?.mintable && badge?.amount.eq(0) && (
                  <>{t('title.freeMintable')}</>
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
