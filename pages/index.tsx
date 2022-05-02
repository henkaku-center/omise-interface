import type { NextPage } from 'next'
import { useAccount } from 'wagmi'
import { Button, Text, Heading } from '@chakra-ui/react'
import { Layout } from '@/components/layouts/layout'

const Home: NextPage = () => {
  const [{ data, error, loading }, disconnect] = useAccount()

  return (
    <>
      <Layout>
        <Heading mt={50}>Front page</Heading>
        <Text fontSize='xs'>{data?.address}</Text>
        <Button mt={10} colorScheme='teal' onClick={disconnect}>
          Disconnect from {data?.connector?.name}
        </Button>
      </Layout>
    </>
  )
}

export default Home
