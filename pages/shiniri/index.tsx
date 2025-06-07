import { Layout } from '@/components/layouts/layout'
import { ConnectMetaMask } from '@/components/metaMask/Connect'
import { contractAddress, getContractAddress } from '@/utils/contractAddress'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { Button, Divider, Heading, Text } from '@chakra-ui/react'
import { FetchTokenResult } from '@wagmi/core'
import { ethers } from 'ethers'
import useTranslation from 'next-translate/useTranslation'
import {
  useAccount,
  useConnect,
  useNetwork,
  useSwitchNetwork,
  useToken
} from 'wagmi'
import { polygon } from 'wagmi/chains'

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
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const henkakuErc20 = getContractAddress({
    name: 'henkakuErc20',
    chainId: chain?.id
  })
  const { data: henkakuToken } = useToken({
    address: henkakuErc20
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

  if (isConnected && chain?.id != polygon.id) {
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
            onClick={() => switchNetwork?.(polygon.id)}
          >
            {t('button.switchNetwork')}
          </Button>
        ) : (
          <p>hmmm, wait something is wrong. maybe reload</p>
        )}
      </Layout>
    )
  }

  if (isConnected && chain?.id == polygon.id) {
    return (
      <Layout>
        <Heading as="h2" color="white.600">
          {t('title.switchedNetwork')}
        </Heading>

        {henkakuToken && (
          <>
            <Divider mt={10} />
            <Button
              mt={5}
              ml="1rem"
              colorScheme="yellow"
              variant="outline"
              rightIcon={<ArrowForwardIcon />}
              onClick={() => addToken(henkakuToken)}
            >
              {t('button.addHenkakuToken')}
            </Button>
          </>
        )}
      </Layout>
    )
  }
}

export default Shiniri
