import { chain, chainId } from 'wagmi'

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
    [chainId.rinkeby]: '0x6FDDbe89B90795Eb0652F80fc3dBC2c61e753b1C',
    [chainId.goerli]: '0x539BCf896f02459dBcB3a2F1D823d2E65DB7211C'
  },
  kamonNFT: {
    [chainId.rinkeby]: '0x9D8b1775CbEE7ae3Cf9dAE3D2CaCBA4986d7df63',
    [chainId.goerli]: '0x539BCf896f02459dBcB3a2F1D823d2E65DB7211C'
  }
}

const defaultChainID = process.env.production
  ? chainId.polygon
  : chainId.goerli

const getContractAddress = ({ name, chainId }: getContractAddressArg) => {
  return contractAddress[name][chainId || defaultChainID]
}

export { contractAddress, defaultChainID, getContractAddress }
