import React from 'react'
import { render } from '@testing-library/react'
import { WagmiProvider, createClient } from 'wagmi'
import { providers } from 'ethers'

import { I18nextProvider } from 'react-i18next'
import i18n from './i18nForTests'
import { RouterContext } from 'next/dist/shared/lib/router-context'

const client = createClient({
  provider(config) {
    return new providers.AlchemyProvider()
  }
})

const mockRouter = {
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  basePath: '/',
  isLocaleDomain: true,
  isReady: true,
  push: jest.fn(),
  prefetch: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn()
  },
  isFallback: false,
  isPreview: false
}

const AllTheProviders = ({ children }) => {
  return (
    <WagmiProvider client={client}>
      <RouterContext.Provider value={mockRouter}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </RouterContext.Provider>
    </WagmiProvider>
  )
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
