import { Provider } from 'wagmi'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Provider autoConnect>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
