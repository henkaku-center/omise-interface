import type { NextPage } from 'next'
import {
  Text,
  Heading,
  Image,
  Box,
  Button,
  Input,
  Stack
} from '@chakra-ui/react'
import { useAccount, useConnect } from 'wagmi'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Layout } from '@/components/layouts/layout'
import { useMounted } from '@/hooks/useMounted'
import { useKeywordSubmit } from '@/hooks/quest/useKeywordSubmit'

const Quests: NextPage = () => {
  const { t } = useTranslation('common')
  const mounted = useMounted()
  const { connect, connectors } = useConnect()
  const [metaMask] = connectors
  const { data } = useAccount()
  const { keyword, inputChange, submit, isSubmitting } = useKeywordSubmit()

  return (
    <>
      <Layout>
        <Heading mt={50}>{t('QUESTS_HEADING')}</Heading>
        <Box display={{ md: 'flex', xl: 'flex' }}>
          <Box p={2} minW={300}>
            <Image
              src="/joi-ito-henkaku-podcast.png"
              alt="{t('QUESTS_IMAGE_ALT')}"
            />
          </Box>
          <Box p={2}>
            <Box w="100%" p={4}>
              <Heading size="md">{t('QUESTS_EXPLANATION_HEADING')}</Heading>
              <Text>
                {t('QUESTS_EXPLANATION_BODY')}
              </Text>
            </Box>
            {mounted && !data?.address ? (
              <Button
                mt={10}
                w="100%"
                colorScheme="teal"
                onClick={() => connect(metaMask)}
              >
                {t('CONNECT_WALLET_BUTTON')}
              </Button>
            ) : (
              <Box mt={4}>
                <Stack>
                  <Input
                    placeholder={t('QUESTS_INPUT_PLACEHOLDER')}
                    onChange={inputChange}
                    textTransform="uppercase"
                  />

                  <Button
                    mt={10}
                    w="100%"
                    colorScheme="teal"
                    onClick={() => submit()}
                    isLoading={isSubmitting}
                    loadingText={t('BUTTON_SUBMITTING')}
                    disabled={keyword == ''}
                  >
                    {t('QUESTS_SUBMIT_BUTTON')}
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>
        </Box>
      </Layout>
    </>
  )
}

interface GetStaticPropsOptions { locale: string }
export async function getStaticProps({ locale }: GetStaticPropsOptions) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
export default Quests
