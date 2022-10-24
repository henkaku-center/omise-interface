import { Provider, createClient, chain } from 'wagmi'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { theme } from '@/components/layouts/theme'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { providers } from 'ethers'

const connector = new MetaMaskConnector({
  chains: [chain.polygon, chain.goerli]
})

const client = createClient({
  autoConnect: true,
  connectors: [connector],
  provider(config) {
    if (config.chainId == chain.polygon.id) {
      return new providers.AlchemyProvider(
        config.chainId,
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      )
    }
    return new providers.AlchemyProvider(config.chainId)
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
