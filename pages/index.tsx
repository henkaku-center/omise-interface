import type { NextPage } from 'next'
import { Heading } from '@chakra-ui/react'
import { Layout } from '@/components/layouts/layout'
import Wallet from '@/components/wallet'

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <Heading mt={50}>Front page</Heading>
        <Wallet />
      </Layout>
    </>
  )
}

export default Home
