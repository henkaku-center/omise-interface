import { providers } from 'ethers'
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

const isChainSupported = (chainId?: number) =>
  chains.some((x) => x.id === chainId)

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
  provider({ chainId }) {
    return new providers.AlchemyProvider(
      isChainSupported(chainId) ? chainId : defaultChain.id,
      alchemyId,
    )
  },})

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Provider client={client}>
      <ChakraProvider>
>>>>>>> c52cd59 (First iteration: wagmi connector component for MetaMask)
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
