import { BigNumber } from 'ethers'
import { displayValue } from '@/utils/bigNumber'

describe('displayValue', () => {
  it('converts wei to string value', () => {
    const value = BigNumber.from('1000000000000000000')
    expect(displayValue(value)).toBe('1')
  })

  it('handles zero correctly', () => {
    const value = BigNumber.from(0)
    expect(displayValue(value)).toBe('0')
  })
})
