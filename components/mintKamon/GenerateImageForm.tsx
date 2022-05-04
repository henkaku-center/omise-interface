import { useAccount } from 'wagmi'
import { useState } from 'react'
import { Button, Heading, Text, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { Layout } from "@/components/layouts/layout"

const GenerateImageForm = () => {
  const { data } = useAccount()
  const [input, setInput] = useState('')
  const handleInputChange = (e: any) => setInput(e.target.value)
  const isError = input === ''
  return (
    <Layout>
      <Heading mt={50}>Henkaku Kamon NFT</Heading>
      <>
        <FormLabel mt={10}>Your address</FormLabel>
        <Text mt={5} fontSize='xs'>{ data?.address }</Text>
        <FormControl isInvalid={isError} isRequired>
          <FormLabel mt={10}>Your name or nickname</FormLabel>
          <Input
            mt={5}
            placeholder='Your name'
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl isInvalid={isError} isRequired>
          <FormLabel mt={10}>Your profile picture for the Kamon NFT</FormLabel>
          <Input
            pt={2}
            mt={5}
            color='gray.300'
            type='file'
            accept={'image/*'}
            isRequired={true}
            placeholder='Upload an JPG or PNG'
          />
        </FormControl>
        <Button mt={10} colorScheme='teal'>
          Generate Image
        </Button>
      </>
    </Layout>
  )
}

export { GenerateImageForm }
