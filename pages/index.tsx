import type { NextPage } from 'next'
import { DAlabLayout } from '@/components/layouts/dlabLayout'
import { Button, Heading, Image, Link, Text } from '@chakra-ui/react'

const Home: NextPage = () => {
  return (
    <>
      <DAlabLayout>
        <Heading as="h2" color="white.600">
          Welcome to DaLab web3 Workshop
        </Heading>
        <Link mt="1rem" href="/w3g/1">
          <Button>
            Go to the mint page
          </Button>
        </Link>
      </DAlabLayout>
    </>
  )
}

export default Home
