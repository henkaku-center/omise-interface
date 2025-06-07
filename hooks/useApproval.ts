import { ethers } from 'ethers'
import { useState } from 'react'
import {
  erc20ABI,
  useContractRead,
  useContractWrite,
  useContractEvent,
  useWalletClient
} from 'wagmi'

const APPROVE_CALLBACK_STATUS = {
  PENDING: 1,
  FAIL: 2,
  FINISH: 3
}

const useApprove = (erc20: string, spender: string) => {
  const [status, setStatus] = useState<number>()
  useWalletClient()
  const { write: contractApprove } = useContractWrite({
    address: erc20,
    abi: erc20ABI,
    functionName: 'approve',
    args: [spender, ethers.constants.MaxUint256],
    onError(error) {
      console.log(error)
      setStatus(APPROVE_CALLBACK_STATUS.FAIL)
    },
    onSuccess() {
      setStatus(APPROVE_CALLBACK_STATUS.PENDING)
    }
  })

  return {
    status: status,
    approve: () => contractApprove()
  }
}

const useApproval = (
  erc20: string,
  spenderAddress: string,
  address: string | undefined
) => {
  const [approved, setApprove] = useState<boolean>()
  useContractRead({
    address: erc20,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address || ethers.constants.AddressZero, spenderAddress],
    onSuccess(data) {
      setApprove(data?.gt(1000) ? true : false)
    }
  })

  try {
    useContractEvent({
      address: erc20,
      abi: erc20ABI,
      eventName: 'Approval',
      listener(event) {
        const [owner, eventAddress, value] = event
        if (owner == address && eventAddress == spenderAddress) {
          setApprove(value?.gt(1000) ? true : false)
        }
      }
    })
  } catch (e: any) {
    console.error(e) // with different chain it occurs
    if (e?.code != ethers.errors.INVALID_ARGUMENT) {
      throw e
    }
  }

  return approved
}

export { useApproval, useApprove, APPROVE_CALLBACK_STATUS }
