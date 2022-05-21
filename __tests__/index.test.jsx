import { render, screen } from '../test-utils'
import Home from '../pages/index'

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)

    const button = screen.getAllByRole('button')[0]
    expect(button).toBeInTheDocument()
  })
})
