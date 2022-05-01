import { Provider } from 'wagmi'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { theme } from '../components/layouts/theme'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Provider autoConnect>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
