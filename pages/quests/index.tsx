import type { NextPage } from 'next'
import { Text, Heading, Image, Box } from '@chakra-ui/react'
import { Layout } from '@/components/layouts/layout'
import Wallet from '../../components/wallet'

const Quests: NextPage = () => {
  return (
    <>
      <Layout>
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
      </Layout>
    </>
  )
}

export default Quests
