import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'next-i18next'

interface ModalProps {
  body: string
  link: string
  cta: string
}

const MetaMaskLeadBanner = () => {
  const { t } = useTranslation('common')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modal, setModal] = useState<ModalProps>()

  useEffect(() => {
    if (!window.ethereum) {
      isMobile
        ? setModal({
            body: t('MMASK_MODAL_MOBILE_BODY'),
            link: 'https://metamask.app.link/dapp/henkaku-membership.vercel.app/',
            cta: t('MMASK_MODAL_MOBILE_CTA')
          })
        : setModal({
            body: t('MMASK_MODAL_BODY'),
            link: 'https://metamask.io/download',
            cta: t('MMASK_MODAL_CTA')
          })

      onOpen()
    }
  }, [])

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size='2xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('MMASK_LEAD_HEADER')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {t('MMASK_LEAD_EXPLANATION')}
            <br />
            {modal?.body}
          </ModalBody>
          <ModalFooter>
            <Button
              as='a'
              href={modal?.link}
              colorScheme='teal'
              target='_blank'
            >
              {modal?.cta}
            </Button>
            &nbsp;
            <Button variant='ghost' mr={3} onClick={onClose}>
              {t('BUTTON_CANCEL')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export { MetaMaskLeadBanner }
