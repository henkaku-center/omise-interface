import {
  Box,
  Button,
  chakra,
  Container,
  Flex,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
  Icon
} from '@chakra-ui/react'
import { FaGithubAlt } from 'react-icons/fa'
import { AiFillTwitterCircle } from "react-icons/ai";

const SocialButton = ({
  children,
  label,
  href
}: {
  children: React.ReactNode
  label: string
  href: string
}) => {
  return (
    <Button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      // w={8}
      // h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Button>
  )
}

export const Footer = () => {
  return (
    <Box
      p={5}
      bottom={0}
      position="relative"
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© 2022 henkaku.org. All rights reserved</Text>
        <Stack direction={'row'} spacing={6}>
          <SocialButton
            label={'Instagram'}
            href={'https://twitter.com/henkakuorg'}
          >
            <Icon as={AiFillTwitterCircle} />
          </SocialButton>
          <SocialButton
            label={'github'}
            href={'https://github.com/henkaku-center/membership-nft-interface'}
          >
            <Text mr={1}>I/F</Text>
            <Icon as={FaGithubAlt} />
          </SocialButton>
          <SocialButton
            label={'github'}
            href={'https://github.com/henkaku-center/kamon-nft'}
          >
            <Text mr={1}>SC</Text>
            <Icon as={FaGithubAlt} />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  )
}
