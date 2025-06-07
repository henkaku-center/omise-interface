import { NextPage } from 'next'
import { useMounted } from '@/hooks/useMounted'
import {
  erc20ABI,
  useAccount,
  useConnect,
  useContractRead,
  useNetwork
} from 'wagmi'
import useTranslation from 'next-translate/useTranslation'
import { Layout } from '@/components/layouts/layout'
import { Button, Flex, Heading, Spacer, Text } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useApproval } from '@/hooks/useApproval'
import { getContractAddress } from '@/utils/contractAddress'
import { useKoukanClaimToken } from '@/hooks/useKoukanCliamToken'
import { Approve } from '@/components/metaMask/Approve'

const Koukan: NextPage = () => {
  const { t } = useTranslation('koukan')
  const mounted = useMounted()
  const { connect, connectors, isConnected } = useConnect()
  const [metaMask] = connectors
  const { data } = useAccount()
  const { chain } = useNetwork()
  const koukan = getContractAddress({
    name: 'koukan',
    chainId: chain?.id
  })
  const henkakuV1Erc20 = getContractAddress({
    name: 'henkakuV1Erc20',
    chainId: chain?.id
  })
  const henkakuV2Erc20 = getContractAddress({
    name: 'henkakuV2Erc20',
    chainId: chain?.id
  })
  const approved = useApproval(henkakuV1Erc20, koukan, data?.address)
  const { isClaiming, isClaimed, claim } = useKoukanClaimToken(
    koukan,
    data?.address
  )
  const { data: balanceOfv1 } = useContractRead(
    {
      addressOrName: henkakuV1Erc20,
      contractInterface: erc20ABI
    },
    'balanceOf',
    {
      args: data?.address || '',
      watch: true
    }
  )
  const { data: balanceOfv2 } = useContractRead(
    {
      addressOrName: henkakuV2Erc20,
      contractInterface: erc20ABI
    },
    'balanceOf',
    {
      args: data?.address || '',
      watch: true
    }
  )

  if (mounted && !isConnected) {
    return (
      <Layout>
        <Button
          mt={10}
          w="100%"
          colorScheme="teal"
          onClick={() => connect({ connector: metaMask })}
        >
          {t('connectWallet')}
        </Button>
      </Layout>
    )
  }
  if (mounted && isConnected && !approved) {
    return (
      <Layout>
        <Heading mt={50}>{t('heading.title')}</Heading>
        <Text>
          {t('v1-amount')}
          {ethers.utils.formatEther(balanceOfv1?.toString() || 0)} $HENKAKU
        </Text>
        <Text>
          {t('v2-amount')}
          {ethers.utils.formatEther(balanceOfv2?.toString() || 0)} $HENKAKU
        </Text>
        <Approve erc20={henkakuV1Erc20} spender={koukan}>
          {t('enable')}
        </Approve>
      </Layout>
    )
  }

  return (
    <>
      <Layout>
        <Flex direction={{ base: 'column', sm: 'row' }}>
          <Flex px={2} mt={4} direction={'column'} justifyContent={'center'}>
            <Heading mt={50}>{t('heading.title')}</Heading>
            {mounted && !isClaimed && (
              <>
                <Text>
                  {t('v1-amount')}
                  {ethers.utils.formatEther(balanceOfv1?.toString() || 0)}{' '}
                  $HENKAKU
                </Text>
                <Text>
                  {t('v2-amount')}
                  {ethers.utils.formatEther(balanceOfv2?.toString() || 0)}{' '}
                  $HENKAKU
                </Text>
                <Button
                  mt={10}
                  w="100%"
                  colorScheme="teal"
                  onClick={() => claim()}
                  isLoading={isClaiming}
                  loadingText={t('isClaiming')}
                >
                  {t('ClaimButton')}
                </Button>
              </>
            )}
            {mounted && isClaimed && <Text>{t('congrats')}</Text>}
          </Flex>
          <Spacer />
        </Flex>
      </Layout>
    </>
  )
}

export default Koukan
