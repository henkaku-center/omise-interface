import { useConnect, useDisconnect } from 'wagmi'
import { useIsMounted } from '../hooks'

import { Button, Text } from '@chakra-ui/react'

const Wallet = () => {
  const isMounted = useIsMounted()
  const { activeConnector, connect, connectors, error, isConnecting, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()

  return (
    <>
      {activeConnector && (
        <Button mt={5} onClick={() => disconnect()}>
          Disconnect
        </Button>
      )}
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
