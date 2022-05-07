import { ArrowForwardIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Button,
  useMediaQuery
} from '@chakra-ui/react'
import React from 'react'
import { chain, useNetwork } from 'wagmi'

export const SwitchNetworkAlert: React.FC = () => {
  const { activeChain, switchNetwork } = useNetwork()
  const [isDesktoppOrTablet] = useMediaQuery('(min-width:600px)')

  if (activeChain == chain.polygon) {
    return <></>
  }

  return switchNetwork ? (
    <Alert
      status="warning"
      flexDirection={isDesktoppOrTablet ? undefined : 'column'}
    >
      <AlertIcon />
      <AlertDescription>
        You are using {activeChain?.name}. To use this app, switch to polygon
        mainnet
      </AlertDescription>

      <Button
        ml="1rem"
        colorScheme="teal"
        variant="outline"
        rightIcon={<ArrowForwardIcon />}
        onClick={() => switchNetwork(chain.polygon.id)}
      >
        switch to polygon
      </Button>
    </Alert>
  ) : (
    <></>
  )
}
