import { Container, Heading, Box, Link, Flex, Spacer } from '@chakra-ui/react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Box padding='4'>
        <Flex>
          <Box p={2}>
            <Heading size='md'>Omise – HENKAKU</Heading>
          </Box>
          <Spacer />
          <Box p={2}>
            <Link href='/' p={4} color='#3c859d' _hover={{}} borderBottom='1px'>
              Home
            </Link>
            <Link href='/quests' p={4} _hover={{}}>
              {/* Override the default text-decoration: underline on hover */}
              Quests
            </Link>
          </Box>
        </Flex>
        <Container>{children}</Container>
      </Box>
    </>
  )
}

export { Layout }
