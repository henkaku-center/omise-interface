import type { NextPage } from 'next'
import { Heading } from '@chakra-ui/react'
import { Layout } from '@/components/layouts/layout'
import Connect from '@/components/connect'

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <Heading mt={50}>Front page</Heading>
        <Connect />
      </Layout>
    </>
  )
}

export default Home
