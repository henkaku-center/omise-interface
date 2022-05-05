import { ethers, Signer } from "ethers"
import { useEffect, useState } from "react"
import { erc20ABI, useAccount, useConnect, useContract, useNetwork, useProvider, useSigner, useWebSocketProvider } from "wagmi"

const APPROVE_CALLBACK_STATUS = {
  PENDING: 1,
  FAIL: 2,
  FINISH: 3,
}

const useApprove = (erc20: string, spender: string) => {
  const [status, setStatus] = useState<number>()
  const { data: signer } = useSigner()
  const contract = useContract({
    addressOrName: erc20,
    contractInterface: erc20ABI,
    signerOrProvider: signer,
  })

  return {
    status: status,
    approve: () => contract.approve(
      spender,
      ethers.constants.MaxUint256
    )
      .then(() => { setStatus(APPROVE_CALLBACK_STATUS.PENDING) })
      .catch(() => { setStatus(APPROVE_CALLBACK_STATUS.FAIL) })
  }
}

const useApproval = (erc20: string, spenderAddress: string) => {
  const [approved, setApprove] = useState<boolean>()
  const [isReady, setReady] = useState<boolean>(false)
  const { data } = useAccount()
  const { data: signer } = useSigner(
    {
      onSuccess() {
        setReady(true)
      },
    }
  )
  const contract = useContract({
    addressOrName: erc20,
    contractInterface: erc20ABI,
    signerOrProvider: signer,
  })

  useEffect(() => {
    if (signer && isReady) {
      contract
        .allowance(data?.address, spenderAddress)
        .then((allowance: ethers.BigNumber) => {
          setApprove(allowance.gt(1000) ? true : false)
        })

      const filter = contract.filters.Approval(data?.address, spenderAddress, null)
      contract.on(filter, (address: string, spender: string, value: ethers.BigNumber) => {
        setApprove(value.gt(1000) ? true : false)
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.address, signer, isReady])

  return approved
}

export { useApproval, useApprove, APPROVE_CALLBACK_STATUS }