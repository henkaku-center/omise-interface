import { ArrowForwardIcon } from '@chakra-ui/icons'
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Button,
  useMediaQuery
} from '@chakra-ui/react'
import React from 'react'
import { chain, useNetwork } from 'wagmi'
import useTranslation from 'next-translate/useTranslation'

export const SwitchNetworkAlert: React.FC = () => {
  const { t } = useTranslation('common')
  const { activeChain, switchNetwork } = useNetwork()
  const [isDesktopOrTablet] = useMediaQuery('(min-width:600px)')

  if (activeChain?.id == chain.polygon.id) {
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
        {activeChain?.name}
        {t('SWITCH_NETWORK_MSG_2')}
      </AlertDescription>

      <Button
        ml="1rem"
        colorScheme="teal"
        variant="outline"
        rightIcon={<ArrowForwardIcon />}
        onClick={() => switchNetwork(chain.polygon.id)}
      >
        {t('SWITCH_NETWORK_BUTTON')}
      </Button>
    </Alert>
  ) : (
    <></>
  )
}
