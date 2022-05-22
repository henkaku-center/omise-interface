import { getContractAddress } from '@/utils/contractAddress'

describe('getContractAddress Functions TestCases', () => {
  it('should return the polygon contract address', () => {
    const result = getContractAddress({
      name: 'kamonNFT',
      chainId: 137
    })
    const expected = '0xbF6F98CB455C73D389B0fB7Ee314C5058569A1A4'

    expect(result).toStrictEqual(expected)
  })
})
