import { chainId } from 'wagmi'

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
    [chainId.goerli]: '0x02Dd992774aBCacAD7D46155Da2301854903118D',
    [chainId.polygon]: '0x0cc91a5FFC2E9370eC565Ab42ECE33bbC08C11a2'
  },
  henkakuV1Erc20: {
    [chainId.goerli]: '0x02Dd992774aBCacAD7D46155Da2301854903118D',
    [chainId.polygon]: '0xd59FFEE93A55F67CeD0F56fa4A991d4c8c8f5C4E'
  },
  henkakuV2Erc20: {
    [chainId.goerli]: '0x77F37AcB17d4C80702dFfF728ff08499A6227D2d',
    [chainId.polygon]: '0x0cc91a5FFC2E9370eC565Ab42ECE33bbC08C11a2'
  },
  koukan: {
    [chainId.goerli]: '0xee7Aea6F80378536998a642f924ccaC31F1c3C59',
    [chainId.polygon]: '0x59003a93a80a807E24a896e14bAA8203d0819398'
  },
  kamonNFT: {
    [chainId.goerli]: '0x539BCf896f02459dBcB3a2F1D823d2E65DB7211C',
    [chainId.polygon]: '0xbF6F98CB455C73D389B0fB7Ee314C5058569A1A4'
  },
  henkakuBadge: {
    [chainId.goerli]: '0x23978aCaeb363ccDE6430085a3c8039414526F81',
    [chainId.polygon]: '0x2C3530B4642ff8fCEb6ab5Fc740381a358968aF1'
  },
  dalabsWSBadge: {
    [chainId.goerli]: '0x002C44b7C9C30271B37B7ffF20d24eb0414Cc7e7',
    [chainId.polygon]: '0xee7Aea6F80378536998a642f924ccaC31F1c3C59'
  },
  dgPoap: {
    [chainId.goerli]: '0xC0Cd0Ea2c8A909E93e0F3929F05862C1477B788E',
    [chainId.polygon]: '0xE16EA5026d26b455D31eB39282B3545003aE6419'
  }
}

const defaultChainID = process.env.production ? chainId.polygon : chainId.goerli

const getContractAddress = ({ name, chainId }: getContractAddressArg) => {
  return contractAddress[name][chainId || defaultChainID]
}

export { contractAddress, defaultChainID, getContractAddress }
