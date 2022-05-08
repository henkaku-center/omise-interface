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

interface ModalProps {
  body: string
  link: string
  cta: string
}

const MetaMaskLeadBanner = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modal, setModal] = useState<ModalProps>()

  useEffect(() => {
    if (!window.ethereum) {
      isMobile
        ? setModal({
            body: 'Go or Install MetaMask App',
            link: 'https://metamask.app.link/dapp/henkaku-membership.vercel.app/',
            cta: 'open MetaMask App'
          })
        : setModal({
            body: 'Install Chrome extension for MetaMask',
            link: 'https://metamask.io/download',
            cta: 'Install Metamask'
          })

      onOpen()
    }
  }, [])

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size='2xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Install Metamask</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Your Browser does not support MetaMask.
            <br />
            To use this web app, You need to have Metamask. <br />
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
            <Button variant='ghost' mr={3} onClick={onClose}>
              cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export { MetaMaskLeadBanner }
