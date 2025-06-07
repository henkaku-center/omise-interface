import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { polygon, goerli } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { theme } from '@/components/layouts/theme'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon, goerli],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === polygon.id)
          return {
            http: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
          }
        if (chain.id === goerli.id)
          return {
            http: `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_DEV}`
          }
        return null
      }
    })
  ]
)

const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient,
  webSocketPublicClient
})

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <WagmiConfig config={config}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </WagmiConfig>
  )
}

export default MyApp
