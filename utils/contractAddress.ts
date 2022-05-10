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
    [chainId.rinkeby]: '0x6FDDbe89B90795Eb0652F80fc3dBC2c61e753b1C'
  },
  kamonNFT: {
    [chainId.rinkeby]: '0x73bf43b830fE47CdeEC85190e99b9a6FCe9b9aaB'
  }
}

const defaultChainID = process.env.production
  ? chainId.polygon
  : chainId.rinkeby

const getContractAddress = ({ name, chainId }: getContractAddressArg) => {
  return contractAddress[name][chainId || defaultChainID]
}

export { contractAddress, defaultChainID, getContractAddress }
