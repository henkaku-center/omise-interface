import type { NextPage } from 'next'
import NextLink from 'next/link'
import { useAccount } from 'wagmi'
import { Button, Text, Container, Heading, Image, Box, Link, Flex, Spacer } from '@chakra-ui/react'

const Home: NextPage = () => {
  const [{ data, error, loading }, disconnect] = useAccount()

  return (
    <>
      <Box padding='4'>
        <Flex>
          <Box p={2}>
            <Heading size='md'>Omise – HENKAKU</Heading>
          </Box>
          <Spacer />
          <Box p={2}>
          <NextLink href='/' passHref>
            <Link p={4} color='#3c859d' _hover={{}} borderBottom='1px'>
                Home
              </Link>
            </NextLink>
            <NextLink href='/quests' passHref>
            <Link p={4} _hover={{}}>{/* Override the default text-decoration: underline on hover */}
                Quests
              </Link>
            </NextLink>
          </Box>
        </Flex>
        <Container>
          <Heading mt={50}>Front page</Heading>
          <Text fontSize='xs'>{data?.address}</Text>
          <Button mt={10} backgroundColor='#3c859d' color='#fff' variant='solid' onClick={disconnect}>
            Disconnect from {data?.connector?.name}
          </Button>
        </Container>
      </Box>
    </>
  )
}

export default Home
