import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { erc20ABI, useAccount, useContract, useNetwork, useSigner } from "wagmi"

const APPROVE_CALLBACK_STATUS = {
  PENDING: 1,
  FAIL: 2,
  FINISH: 3,
}

const useApprove = (contractAddress: string, sepnder: string) => {
  const [status, setStatus] = useState<number>()
  const { data } = useAccount()
  const { data: signer } = useSigner()
  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: erc20ABI,
    signerOrProvider: signer,
  })

  useEffect(() => {
    if (signer) {
      const filter = contract.filters.Approval(data?.address, contractAddress, null)
      contract.on(filter, (address: string, sepnder: string, value: ethers.BigNumber) => {
        setStatus(APPROVE_CALLBACK_STATUS.FINISH)
      })
    }

  }, [contract, contractAddress, data?.address, signer])

  return {
    status: status,
    approve: () => contract.approve(
      sepnder,
      ethers.constants.MaxUint256
    )
      .then(() => { setStatus(APPROVE_CALLBACK_STATUS.PENDING) })
      .catch(() => { setStatus(APPROVE_CALLBACK_STATUS.FAIL) })
  }
}

const useApproval = (contractAddress: string) => {
  const [approved, setApprove] = useState(false)
  const { data } = useAccount()
  const { data: signer } = useSigner()
  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: erc20ABI,
    signerOrProvider: signer,
  })

  useEffect(() => {
    if (signer) {
      contract
        .allowance(data?.address, contractAddress)
        .then((allowance: ethers.BigNumber) => {
          setApprove(allowance.gt(1000) ? true : false)
        })

      const filter = contract.filters.Approval(data?.address, contractAddress, null)
      contract.on(filter, (address: string, sepnder: string, value: ethers.BigNumber) => {
        setApprove(value.gt(1000) ? true : false)
      })
    }

  }, [contract, contractAddress, data?.address, signer])

  return approved
}

export { useApproval, useApprove, APPROVE_CALLBACK_STATUS }