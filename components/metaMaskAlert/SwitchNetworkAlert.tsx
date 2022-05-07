import { ArrowForwardIcon } from '@chakra-ui/icons'
import { Alert, AlertIcon, Button } from '@chakra-ui/react'
import React from 'react'
import { chain, useNetwork } from 'wagmi'

export const SwitchNetworkAlert: React.FC = () => {
  const { activeChain, switchNetwork } = useNetwork()

  if (activeChain == chain.polygon) {
    return <></>
  }

  return (
    switchNetwork ? (
      <Alert status="warning">
        <AlertIcon />
        You are using {activeChain?.name}. To use this app, switch to polygon
        mainnet
        <br />
        <Button
          ml="1.5rem"
          colorScheme="teal"
          variant="outline"
          rightIcon={<ArrowForwardIcon />}
          onClick={() => switchNetwork(chain.polygon.id)}
        >
          switch to polygon
        </Button>
      </Alert>
    ) : (<></>)
  )
}
