import { ArrowForwardIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Button,
  useMediaQuery
} from '@chakra-ui/react'
import React from 'react'
import { polygon } from 'wagmi/chains'
import { useNetwork, useSwitchNetwork } from 'wagmi'
import useTranslation from 'next-translate/useTranslation'

export const SwitchNetworkAlert: React.FC = () => {
  const { t } = useTranslation('common')
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const [isDesktopOrTablet] = useMediaQuery('(min-width:600px)')

  if (chain?.id == polygon.id) {
    return <></>
  }

  return switchNetwork ? (
    <Alert
      status="warning"
      flexDirection={isDesktopOrTablet ? undefined : 'column'}
    >
      <AlertIcon />
      <AlertDescription>
        {t('SWITCH_NETWORK_MSG_1')}
        {chain?.name}
        {t('SWITCH_NETWORK_MSG_2')}
      </AlertDescription>

      <Button
        ml="1rem"
        colorScheme="teal"
        variant="outline"
        rightIcon={<ArrowForwardIcon />}
        onClick={() => switchNetwork?.(polygon.id)}
      >
        {t('SWITCH_NETWORK_BUTTON')}
      </Button>
    </Alert>
  ) : (
    <></>
  )
}
