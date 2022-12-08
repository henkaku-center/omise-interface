import { Layout } from '@/components/layouts/layout'
import { ConnectMetaMask } from '@/components/metaMask/Connect'
import { contractAddress, getContractAddress } from '@/utils/contractAddress'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { Button, Divider, Heading, Text } from '@chakra-ui/react'
import { FetchTokenResult } from '@wagmi/core'
import { ethers } from 'ethers'
import useTranslation from 'next-translate/useTranslation'
import { chainId, useAccount, useConnect, useNetwork, useToken } from 'wagmi'

const addToken = async (token: FetchTokenResult) => {
  if (window.ethereum) {
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: token.address, // The address that the token is at.
          symbol: token.symbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: token.decimals, // The number of decimals in the token
          image: 'https://omise.henkaku.org/henkakuToken.png' // A string url of the token logo
        }
      }
    })
  }
}
const Shiniri = () => {
  const { t } = useTranslation('shiniri')
  const { data } = useAccount()
  const { isConnected } = useConnect()
  const { activeChain, switchNetwork } = useNetwork()
  const henkakuErc20 = getContractAddress({
    name: 'henkakuErc20',
    chainId: activeChain?.id
  })
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
        <Text mb={5}>wallet address: {data?.address}</Text>

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
