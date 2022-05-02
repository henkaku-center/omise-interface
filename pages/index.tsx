import type { NextPage } from 'next'
import { useAccount } from 'wagmi'
import { Heading } from '@chakra-ui/react'
import { Layout } from '@/components/layouts/layout'
import Connect from '@/components/Connect'
import Account from '@/components/Account'
import { useIsMounted } from '@/hooks'

const Home: NextPage = () => {
  const isMounted = useIsMounted()
  const { data } = useAccount()

  return (
    <>
      <Layout>
        <Heading mt={50}>Front page</Heading>
        <Connect />
        {isMounted && data && (
          <>
            <Account />
          </>
        )}
      </Layout>
    </>
  )
}

export default Home
