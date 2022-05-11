import { ethers } from 'ethers'
import { useState } from 'react'
import {
  erc20ABI,
  useContractRead,
  useContractWrite,
  useContractEvent,
  useSigner
} from 'wagmi'

const APPROVE_CALLBACK_STATUS = {
  PENDING: 1,
  FAIL: 2,
  FINISH: 3
}

const useApprove = (erc20: string, spender: string) => {
  const [status, setStatus] = useState<number>()
  const { data: signer } = useSigner()
  const { write: contractApprove } = useContractWrite(
    {
      addressOrName: erc20,
      contractInterface: erc20ABI,
      signerOrProvider: signer
    },
    'approve',
    {
      args: [spender, ethers.constants.MaxUint256],
      onError(error) {
        console.log(error)
        setStatus(APPROVE_CALLBACK_STATUS.FAIL)
      },
      onSuccess(data) {
        setStatus(APPROVE_CALLBACK_STATUS.PENDING)
      }
    }
  )

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
  useContractRead(
    {
      addressOrName: erc20,
      contractInterface: erc20ABI
    },
    'allowance',
    {
      args: [address || ethers.constants.AddressZero, spenderAddress],
      onSuccess(data) {
        setApprove(data?.gt(1000) ? true : false)
      }
    }
  )

  try {
    useContractEvent(
      {
        addressOrName: erc20,
        contractInterface: erc20ABI
      },
      'Approval ',
      (event) => {
        const [owner, eventAddress, value] = event
        if (owner == address && eventAddress == spenderAddress) {
          setApprove(value?.gt(1000) ? true : false)
        }
      }
    )
  } catch (e: any) {
    console.error(e) // with different chain it occurs
    if (e?.code != ethers.errors.INVALID_ARGUMENT) {
      throw e
    }
  }

  return approved
}

export { useApproval, useApprove, APPROVE_CALLBACK_STATUS }
