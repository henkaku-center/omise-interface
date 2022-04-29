import { Button, Text } from '@chakra-ui/react'
import React from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useIsMounted } from '../hooks'

const Wallet = () => {
  const { data: account } = useAccount()
  const { connect, connectors, error, isConnecting, pendingConnector, activeConnector } =
    useConnect()
  const { disconnect } = useDisconnect()
  const isMounted = useIsMounted()

  if (account) {
    return (
      <>
        {/* <Text mt={5}>{ account.address }</Text> */}
        <Button mt={10} onClick={() => disconnect()}>Disconnect</Button>
      </>
    )
  }

  return (
    <>
      {connectors.filter((x) => isMounted && x.ready && x.id !== activeConnector?.id).map((connector) => (
        <Button
          mt={10}
          backgroundColor='#3c859d'
          color='#fff'
          variant='solid'
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect(connector)}
        >
          Connect with {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isConnecting &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </Button>
      ))}

      {error && <Text>{error.message}</Text>}
    </>
  )
}

export default Wallet