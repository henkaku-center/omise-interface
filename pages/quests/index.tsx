import type { NextPage } from 'next'
import { Text, Heading, Image, Box, Button } from '@chakra-ui/react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Layout } from '@/components/layouts/layout'
import { useMounted } from '@/hooks/useMounted'

const Quests: NextPage = () => {
  const mounted = useMounted()
  const { connect, connectors } = useConnect()
  const [metaMask] = connectors
  const { data } = useAccount()

  return (
    <>
      <Layout>
        <Heading mt={50}>Quest</Heading>
        <Box display={{ md: 'flex', xl: 'flex' }}>
          <Box p={2} minW={300}>
            <Image
              src="/joi-ito-henkaku-podcast.png"
              alt="JOI ITO 変革への道"
            />
          </Box>
          <Box p={2}>
            <Box bg="lightgray" w="100%" p={4}>
              <Heading size="md">Enter weekly keyword</Heading>
              <Text>
                By answering this question you will earn 100 points, which you
                can exchange to $HENKAKU tokens.
              </Text>
            </Box>
            {mounted && !data?.address && (
              <Button
                mt={10}
                w="100%"
                colorScheme="teal"
                onClick={() => connect(metaMask)}
              >
                connect wallet
              </Button>
            )}
            {/*TODO: Add form component */}
          </Box>
        </Box>
      </Layout>
    </>
  )
}

export default Quests
