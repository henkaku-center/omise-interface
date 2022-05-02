import type { NextPage } from 'next'
import NextLink from 'next/link'
import { Text, Container, Heading, Image, Box, Link, Flex, Spacer } from '@chakra-ui/react'
import Wallet from '../../components/wallet'

const Quests: NextPage = () => {
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
              <Link p={4} _hover={{}}>{/* Override the default text-decoration: underline on hover */}
                Home
              </Link>
            </NextLink>
            <NextLink href='/quests' passHref>
              <Link p={4} color='#3c859d' _hover={{}} borderBottom='1px'>
                Quests
              </Link>
            </NextLink>
          </Box>
        </Flex>
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
              <Wallet />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default Quests
