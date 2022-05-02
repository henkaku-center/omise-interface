import { Provider, chain, createClient, defaultChains } from 'wagmi'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
<<<<<<< HEAD
import { theme } from '@/components/layouts/theme'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Provider autoConnect>
      <ChakraProvider theme={theme}>
=======
import { InjectedConnector } from 'wagmi/connectors/injected'

// API key for Ethereum node
// Two popular services are Alchemy (alchemy.com) and Infura (infura.io)
const alchemyId = process.env.ALCHEMY_ID

const chains = defaultChains
const defaultChain = chain.mainnet

// Set up connectors
const client = createClient({
  autoConnect: true,
  connectors({ chainId }: any) {
    const chain = chains.find((x) => x.id === chainId) ?? defaultChain
    const rpcUrl = chain.rpcUrls.alchemy
      ? `${chain.rpcUrls.alchemy}/${alchemyId}`
      : chain.rpcUrls.default
    return [
      new InjectedConnector(),
    ]
  },
})

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Provider>
      <ChakraProvider>
>>>>>>> c52cd59 (First iteration: wagmi connector component for MetaMask)
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
