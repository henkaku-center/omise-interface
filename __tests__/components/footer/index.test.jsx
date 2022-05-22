import { render } from '@testing-library/react'
import { Footer } from '@/components/footer'
import { useTranslation } from 'react-i18next'

jest.mock('react-i18next')

it('matches snapshot', () => {
  const { asFragment } = render(<Footer />)
  expect(asFragment()).toMatchSnapshot()
})
