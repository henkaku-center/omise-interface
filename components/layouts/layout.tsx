import { Container, Heading, Box, Link, Flex, Spacer } from '@chakra-ui/react'
import { SwitchNetworkAlert } from '@/components/metaMask/SwitchNetworkAlert'
import { MetaMaskLeadBanner } from '@/components/metaMask/MetaMaskLeadBanner'
import { Footer } from '@/components/footer'
import { useLocale } from '@/hooks/useLocale'
import { default as NextLink } from 'next/link'
interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { locale, t } = useLocale()
  return (
    <>
      <SwitchNetworkAlert />
      <MetaMaskLeadBanner />
      <Box p="4">
        <Flex>
          <Box p={2}>
            <Heading size="md">{t.LAYOUT_HEADING}</Heading>
          </Box>
          <Spacer />
          <Box p={2}>
            <Link href="/" p={4}>
              {t.HOME_LINK}
            </Link>
            <Link href="/quests" p={4}>
              {t.QUESTS_LINK}
            </Link>
            {locale === 'en' ? (
              <NextLink href="/" locale="ja" passHref={true}>
                <a>{t.LANG_SWITCHER}</a>
              </NextLink>
            ) : (
              <NextLink href="/" locale="en" passHref={true}>
                <a>{t.LANG_SWITCHER}</a>
              </NextLink>
            )}
          </Box>
        </Flex>
      </Box>
      <Container maxW="4xl">{children}</Container>
      <Footer />
    </>
  )
}

export { Layout }
