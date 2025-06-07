import { goerli, polygon } from 'wagmi/chains'

interface ContractAddress {
  [name: string]: {
    [chainId: number]: string
  }
}

interface getContractAddressArg {
  name: keyof ContractAddress
  chainId: number | undefined
}

const contractAddress: ContractAddress = {
  henkakuErc20: {
    [goerli.id]: '0x02Dd992774aBCacAD7D46155Da2301854903118D',
    [polygon.id]: '0x0cc91a5FFC2E9370eC565Ab42ECE33bbC08C11a2'
  },
  henkakuV1Erc20: {
    [goerli.id]: '0x02Dd992774aBCacAD7D46155Da2301854903118D',
    [polygon.id]: '0xd59FFEE93A55F67CeD0F56fa4A991d4c8c8f5C4E'
  },
  henkakuV2Erc20: {
    [goerli.id]: '0x77F37AcB17d4C80702dFfF728ff08499A6227D2d',
    [polygon.id]: '0x0cc91a5FFC2E9370eC565Ab42ECE33bbC08C11a2'
  },
  koukan: {
    [goerli.id]: '0xee7Aea6F80378536998a642f924ccaC31F1c3C59',
    [polygon.id]: '0x59003a93a80a807E24a896e14bAA8203d0819398'
  },
  kamonNFT: {
    [goerli.id]: '0x539BCf896f02459dBcB3a2F1D823d2E65DB7211C',
    [polygon.id]: '0xbF6F98CB455C73D389B0fB7Ee314C5058569A1A4'
  },
  henkakuBadge: {
    [goerli.id]: '0x23978aCaeb363ccDE6430085a3c8039414526F81',
    [polygon.id]: '0x2C3530B4642ff8fCEb6ab5Fc740381a358968aF1'
  },
  dalabsWSBadge: {
    [goerli.id]: '0x2C3530B4642ff8fCEb6ab5Fc740381a358968aF1',
    [polygon.id]: '0xee7Aea6F80378536998a642f924ccaC31F1c3C59'
  },
  dgPoap: {
    [goerli.id]: '0xC0Cd0Ea2c8A909E93e0F3929F05862C1477B788E',
    [polygon.id]: '0xE16EA5026d26b455D31eB39282B3545003aE6419'
  }
}

const defaultChainID = process.env.production ? polygon.id : goerli.id

const getContractAddress = ({ name, chainId }: getContractAddressArg) => {
  return contractAddress[name][chainId || defaultChainID]
}

export { contractAddress, defaultChainID, getContractAddress }
