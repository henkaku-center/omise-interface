import type { NextPage } from 'next'
import { useAccount } from 'wagmi'
import { Button, Text, Container, Heading } from '@chakra-ui/react'


const Home: NextPage = () => {
  const [{ data, error, loading }, disconnect] = useAccount()

  return (
    <>
      <Container >
        <Heading mt={50}>welcome to henkaku</Heading>
        <Text>{data?.address}</Text>
        <Button mt={10} colorScheme='teal' variant='solid' onClick={disconnect}>
          Disconnect from {data?.connector?.name}
        </Button>
      </Container>
    </>
  )
}

export default Home
