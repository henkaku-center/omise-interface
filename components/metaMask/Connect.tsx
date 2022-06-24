import { useConnect } from 'wagmi'
import { Button, styled } from '@chakra-ui/react'
import React from 'react'

interface Props {
  style?: any;
  children?: React.ReactNode
}

export const ConnectMetaMask: React.FC<Props> = ({ style, children }) => {
  const { connect, connectors, isConnected, isConnecting } = useConnect()
  const [metaMask] = connectors

  return (
    <>
      <Button
        onClick={() => connect(metaMask)}
        style={style}
        colorScheme="teal"
        mt={2}
        loadingText="connecting..."
        isLoading={isConnecting}
      >
        {children}
      </Button>
    </>
  )
}
