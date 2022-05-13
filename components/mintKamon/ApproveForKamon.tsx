import { Heading, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { Approve } from '@/components/metaMask/Approve'

interface Props {
  erc20: string
  spender: string
}

export const ApproveForKamon: React.FC<Props> = ({ erc20, spender }) => {
  const { t } = useTranslation('common')

  return (
    <>
      <Heading as="h2" color="white.600">
        {t('MINT_YOUR_KAMON_HEADING')}{' '}
      </Heading>
      <Text m="1rem">{t('MINT_YOUR_KAMON_EXPLANATION')}</Text>
      <Text>{t('ENABLE_EXPLANATION')}</Text>
      <Approve erc20={erc20} spender={spender}>
        {t('ENABLE_BUTTON')}
      </Approve>
    </>
  )
}
