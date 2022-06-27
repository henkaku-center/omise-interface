import { BigNumber } from 'ethers'

const displayValue = (number: BigNumber) => {
  return number.div(BigNumber.from(10).pow(18)).toString()
}

export { displayValue }
