import {
  Container,
  Heading,
  Box,
  Link,
  Flex,
  Spacer,
  useColorMode,
  Button,
  Stack
} from '@chakra-ui/react'
import { default as NextLink } from 'next/link'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { SwitchNetworkAlert } from '@/components/metaMask/SwitchNetworkAlert'
import { MetaMaskLeadBanner } from '@/components/metaMask/MetaMaskLeadBanner'
import { Footer } from '@/components/footer'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import setLanguage from 'next-translate/setLanguage'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter()
  const { t, lang } = useTranslation('common')
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <>
      <SwitchNetworkAlert />
      <MetaMaskLeadBanner />
      <Box p="4">
        <Flex>
          <Box p={2}>
            <NextLink passHref href="/" locale={router.locale}>
              <Link href="/">
                <Heading size="md">{t('LAYOUT_HEADING')}</Heading>
              </Link>
            </NextLink>
          </Box>
          <Spacer />
          <Stack direction="row" spacing={4}>
            <NextLink passHref href="/" locale={router.locale}>
              <Link _focus={{ boxShadow: 'none' }} href="/" p={4}>
                {t('HOME_LINK')}
              </Link>
            </NextLink>
            <NextLink passHref href="/claim" locale={router.locale}>
              <Link _focus={{ boxShadow: 'none' }} p={4}>
                {t('CLAIM_LINK')}
              </Link>
            </NextLink>
            <NextLink passHref href="/quests" locale={router.locale}>
              <Link _focus={{ boxShadow: 'none' }} p={4}>
                {t('QUESTS_LINK')}
              </Link>
            </NextLink>
            <NextLink passHref href="/badges" locale={router.locale}>
              <Link _focus={{ boxShadow: 'none' }} p={4}>
                {t('BADGES_LINK')}
              </Link>
            </NextLink>

            <Button size="md" onClick={toggleColorMode} p={4}>
              {colorMode == 'dark' ? <SunIcon /> : <MoonIcon />}
            </Button>
            <Button
              size="md"
              onClick={async () =>
                await setLanguage(lang == 'en' ? 'ja' : 'en')
              }
            >
              {lang == 'en' ? '日本語' : 'English'}
            </Button>
          </Stack>
        </Flex>
      </Box>
      <Container maxW="4xl">{children}</Container>
      <Footer />
    </>
  )
}

export { Layout }
