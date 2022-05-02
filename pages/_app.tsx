import type { AppProps } from 'next/app'
import { providers } from 'ethers'

import { Provider, chain, createClient, defaultChains } from 'wagmi'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { theme } from '@/components/layouts/theme'

import { InjectedConnector } from 'wagmi/connectors/injected'

import { ChakraProvider } from '@chakra-ui/react'

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID
const chains = defaultChains
const defaultChain = chain.mainnet

const isChainSupported = (chainId?: number) =>
  chains.some((x) => x.id === chainId)

const client = createClient({
  autoConnect: true,
  connectors() {
    return [
      new InjectedConnector({ chains }),
    ]
  },
  provider({ chainId }) {
    return new providers.InfuraProvider(
      isChainSupported(chainId) ? chainId : defaultChain.id,
      infuraId,
    )
  },})

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
