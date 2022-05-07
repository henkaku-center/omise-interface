import { ethers } from "ethers"
import { useState } from "react"
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  useContractEvent,
  useSigner
} from "wagmi"

const APPROVE_CALLBACK_STATUS = {
  PENDING: 1,
  FAIL: 2,
  FINISH: 3,
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
    })

  return {
    status: status,
    approve: () => contractApprove()
  }
}

const useApproval = (erc20: string, spenderAddress: string) => {
  const [approved, setApprove] = useState<boolean>()
  const { data } = useAccount()
  useContractRead({
    addressOrName: erc20,
    contractInterface: erc20ABI,
  },
    'allowance',
    {
      args: [data?.address, spenderAddress],
      onSuccess(data) {
        setApprove(data?.gt(1000) ? true : false)
      }
    },
  )

  try {
    useContractEvent(
      {
        addressOrName: erc20,
        contractInterface: erc20ABI,
      },
      'Approval ',
      (event) => {
        const [owner, address, value] = event
        if (owner == data?.address && address == spenderAddress) {
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