import type { NextPage } from 'next'
import { useAccount } from 'wagmi'
import { Button, Heading } from '@chakra-ui/react'
import { useState } from 'react'
import { useConnect } from 'wagmi'

import { Layout } from '@/components/layouts/layout'
import { GenerateImageForm } from '@/components/mintKamon/GenerateImageForm'
import { useMounted } from '@/hooks/useMounted'

const MintKamon: NextPage = () => {
  const mounted = useMounted()
  const { connect, connectors, error } = useConnect()
  const [metaMask] = connectors
  const { data } = useAccount()

  const [tokenURI, setTokenURI] = useState('')
  const [approved, setApprove] = useState(false)

  if (false && !tokenURI) {
    return <GenerateImageForm />
  }

  return (
    <>
      <Layout>
        <Heading mt={50}>Henkaku kamon nft</Heading>
        {mounted && data?.address}
        {mounted && !data?.address && (
          <Button colorScheme='teal' onClick={() => connect(metaMask)}>
            connect wallet
          </Button>
        )}

        {error && <div>{error.message}</div>}
        {mounted && data?.address &&
          (tokenURI && approved ? (
            <Button mt={10} colorScheme='teal'>
              Mint with 1000 henkaku
            </Button>
          ) : (
            <Button mt={10} colorScheme='teal'>
              enable to get kamon nft
            </Button>
          ))}
      </Layout>
    </>
  )
}

export default MintKamon
