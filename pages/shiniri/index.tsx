import { Layout } from '@/components/layouts/layout'
import { ConnectMetaMask } from '@/components/metaMask/Connect'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { Button, Heading, Text } from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import { chainId, useAccount, useConnect, useNetwork } from 'wagmi'

const Shiniri = () => {
  const { t } = useTranslation('shiniri')
  const { data } = useAccount()
  const { isConnected } = useConnect()
  const { activeChain, switchNetwork } = useNetwork()
  if (!isConnected) {
    return (
      <Layout>
        <Heading as="h2" color="white.600">
          {t('title.connectWallet')}
        </Heading>
        <ConnectMetaMask style={{ with: '60%' }}>
          {t('button.connectWallet')}
        </ConnectMetaMask>
      </Layout>
    )
  }

  if (isConnected && activeChain?.id != chainId.polygon) {
    return (
      <Layout>
        <Heading as="h2" color="white.600">
          {t('title.switchNetwork')}
        </Heading>
        <Text mb={5}>
          wallet address: {data?.address}
        </Text>

        {switchNetwork ? (
          <Button
            ml="1rem"
            colorScheme="teal"
            variant="outline"
            rightIcon={<ArrowForwardIcon />}
            onClick={() => switchNetwork(chainId.polygon)}
          >
            {t('button.switchNetwork')}
          </Button>
        ) : (
          <p>hmmm, wait something is wrong. maybe reload</p>
        )}
      </Layout>
    )
  }

  if (isConnected && activeChain?.id == chainId.polygon) {
    return (
      <Layout>
        <Heading as="h2" color="white.600">
          {t('title.switchedNetwork')}
        </Heading>
      </Layout>
    )
  }
}

export default Shiniri
