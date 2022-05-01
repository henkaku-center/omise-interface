import type { NextPage } from 'next'
import { useAccount } from 'wagmi'
import { Button, Text, Heading } from '@chakra-ui/react'
import { useState } from 'react'
import { Layout } from '../../components/layouts/layout'
import { GenerateImageForm } from '../../components/mintKamon/GenerateImageForm'

const MintKamon: NextPage = () => {
  const [{ data, error, loading }, disconnect] = useAccount()
  const [tokenURI, setTokenURI] = useState('')
  const [approved, setApprove] = useState(false)

  if (!tokenURI) {
    return <GenerateImageForm />
  }

  return (
    <>
      <Layout>
        <Heading mt={50}>Henkaku kamon nft</Heading>
        <Text fontSize='xs'>{data?.address}</Text>
        {tokenURI && approved ? (
          <Button mt={10} colorScheme='teal'>
            Mint with 1000 henkaku
          </Button>
        ) : (
          <Button mt={10} colorScheme='teal'>
            enable to get kamon nft
          </Button>
        )}
      </Layout>
    </>
  )
}

export default MintKamon
