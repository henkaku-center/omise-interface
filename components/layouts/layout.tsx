import {
  Container,
  Heading,
  Box,
  Link,
  Flex,
  Spacer,
  useColorMode,
  Button
} from '@chakra-ui/react'
import { default as NextLink } from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { SwitchNetworkAlert } from '@/components/metaMask/SwitchNetworkAlert'
import { MetaMaskLeadBanner } from '@/components/metaMask/MetaMaskLeadBanner'
import { Footer } from '@/components/footer'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <>
      <SwitchNetworkAlert />
      <MetaMaskLeadBanner />
      <Box p="4">
        <Flex>
          <Box p={2}>
            <Heading size="md">{t('LAYOUT_HEADING')}</Heading>
          </Box>
          <Spacer />
          <Box p={2}>
            <Button size="md" onClick={toggleColorMode} p={4}>
              {colorMode == 'dark' ? <SunIcon /> : <MoonIcon />}
            </Button>
            <NextLink passHref href="/" locale={router.locale}>
              <Link p={4}>{t('HOME_LINK')}</Link>
            </NextLink>
            <NextLink passHref href="/claim" locale={router.locale}>
              <Link p={4}>{t('CLAIM_LINK')}</Link>
            </NextLink>
            <NextLink passHref href="/quests" locale={router.locale}>
              <Link p={4}>{t('QUESTS_LINK')}</Link>
            </NextLink>
            <NextLink
              passHref
              href={router.pathname}
              locale={router.locale === 'en' ? 'ja' : 'en'}
            >
              <Link>{t('LANG_SWITCHER')}</Link>
            </NextLink>
          </Box>
        </Flex>
      </Box>
      <Container maxW="4xl">{children}</Container>
      <Footer />
    </>
  )
}

export { Layout }
