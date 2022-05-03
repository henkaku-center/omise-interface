import { Provider, createClient } from 'wagmi'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { theme } from '@/components/layouts/theme'
import { chain } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

  const connector = new MetaMaskConnector({
    chains: [chain.polygon, chain.rinkeby],
  })

  const client = createClient({
    autoConnect: true,
    connectors: [connector],
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
