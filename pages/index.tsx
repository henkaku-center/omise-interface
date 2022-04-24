import type { NextPage } from 'next'
import { useAccount } from 'wagmi'
import { Button, Text, Container, Heading, Image, Box } from '@chakra-ui/react'

const Home: NextPage = () => {
  const [{ data, error, loading }, disconnect] = useAccount()

  return (
    <>
      <Box padding='4'>
        <Heading size='md'>Omise – HENKAKU</Heading>
        <Container>
          <Heading mt={50}>Quest</Heading>
          <Box display={{ md: 'flex', xl: 'flex' }}>
            <Box p={2} minW={300}>
              <Image src='/joi-ito-henkaku-podcast.png' alt='JOI ITO 変革への道' />
            </Box>
            <Box p={2}>
              <Box bg='#ccc' w='100%' p={4}>
                <Heading size='md'>Enter weekly keyword</Heading>
                <Text>
                  By answering this question you will earn 100 points, which you can exchange to $HENKAKU tokens.
                </Text>
              </Box>
              <Text fontSize='xs'>{data?.address}</Text>
              <Button mt={10} backgroundColor='#3c859d' color='#fff' variant='solid' onClick={disconnect}>
                Disconnect from {data?.connector?.name}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default Home
