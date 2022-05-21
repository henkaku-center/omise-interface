import { render, screen } from '../test-utils'
import Home from '../pages/index'
import { generateTestingUtils } from 'eth-testing'

describe('Footer', () => {
  const testingUtils = generateTestingUtils({ providerType: 'MetaMask' })
  beforeAll(() => {
    // Manually inject the mocked provider in the window as MetaMask does
    global.window.ethereum = testingUtils.getProvider()
  })
  afterEach(() => {
    // Clear all mocks between tests
    testingUtils.clearAllMocks()
  })

  it('renders a heading', () => {
    render(<Home />)

    const heading = screen.getAllByRole('button')[0]

    expect(heading).toBeTruthy()
  })
})
