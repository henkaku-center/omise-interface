import type { NextPage } from 'next'
import { Text, Heading, Image, Box } from '@chakra-ui/react'
import { Layout } from '@/components/layouts/layout'
import Connect from '../../components/connect'

const Quests: NextPage = () => {
  return (
    <>
      <Layout>
        <Heading mt={50}>Quests</Heading>
        <Box display={{ md: 'flex', xl: 'flex' }}>
          <Box p={2} minW={300}>
            <Image src='/joi-ito-henkaku-podcast.png' alt='JOI ITO 変革への道' />
          </Box>
          <Box p={2}>
            <Box bg='gray.300' w='100%' p={4}>
              <Heading size='md'>Enter Weekly Keyword</Heading>
              <Text>
                By answering this question, you will earn 100 points which can be exchanged to $HENKAKU tokens.
              </Text>
            </Box>
            <Connect />
          </Box>
        </Box>
      </Layout>
    </>
  )
}

export default Quests
