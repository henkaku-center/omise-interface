import { APPROVE_CALLBACK_STATUS, useApprove } from '@/hooks/useApproval'
import { Button } from '@chakra-ui/react'
import React from 'react'

interface Props {
  erc20: string
  spender: string
  children: React.ReactNode
}

export const Approve: React.FC<Props> = ({ erc20, spender, children }) => {
  const { status, approve } = useApprove(erc20, spender)

  return (
    <Button
      colorScheme="teal"
      mt={2}
      onClick={approve}
      isLoading={status == APPROVE_CALLBACK_STATUS.PENDING}
    >
      {children}
    </Button>
  )
}
