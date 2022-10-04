import { Provider, createClient, chain } from 'wagmi'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { theme } from '@/components/layouts/theme'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { providers } from 'ethers'

import { defaultChainID } from '@/utils/contractAddress'

const connector = new MetaMaskConnector({
  chains: [chain.polygon, chain.goerli]
})

const client = createClient({
  autoConnect: true,
  connectors: [connector],
  provider() {
    if (defaultChainID == chain.polygon.id) {
      return new providers.AlchemyProvider(
        chain.polygon.id,
        process.env.ALCHEMY_API_KEY
      )
    }
    return new providers.AlchemyProvider(defaultChainID)
  }
})

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Provider client={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
