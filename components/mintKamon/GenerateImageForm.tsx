import { useAccount } from 'wagmi'
import { useState } from 'react'
import { Button, Heading, Text, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { Layout } from '@/components/layouts/layout'

const GenerateImageForm = () => {
  const { data } = useAccount()
  const [input, setInput] = useState('')
  const handleInputChange = (e: any) => setInput(e.target.value)
  const handleFileChange = (e: any) => setInput(e.target.files[0])
  const isError = input === ''

  const submitGenerateImage = async (event: any) => {
    event.preventDefault()
    const imageFile = event.target.profilePicture.files[0]
    const blobToBase64 = (blob: any): Promise<string> => {
      return new Promise<string>((resolve, _) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (typeof reader.result == 'string') {
            resolve(reader.result)
          } else {
            resolve('')
          }
        }
        reader.readAsDataURL(blob)
      })
    }
    const payLoad = {
      name: event.target.name.value,
      address: data?.address,
      roles: ['Community member'],
      points: 100,
      date: ~~(new Date().getTime() / 1000),
      profilePicture: await blobToBase64(imageFile),
    }

    const res = await fetch(
      'http://localhost:4100/ipfs',
      {
        body: JSON.stringify(payLoad),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    )
    const result = await res.json()
    const tokenURI = result.tokenUri
    console.log(tokenURI)
  }

  return (
    <Layout>
      <Heading mt={50}>Henkaku Kamon NFT</Heading>
      <form onSubmit={ submitGenerateImage }>
        <FormLabel mt={10}>Your address</FormLabel>
        <Text mt={5} fontSize='xs'>{ data?.address }</Text>
        <FormControl isInvalid={isError} isRequired>
          <FormLabel mt={10}>Your name or nickname</FormLabel>
          <Input
            mt={5}
            placeholder='Your name'
            name='name'
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl isInvalid={isError} isRequired>
          <FormLabel mt={10}>Your profile picture for the Kamon NFT</FormLabel>
          <Input
            pt={1}
            mt={5}
            color='gray.300'
            type='file'
            accept={'image/*'}
            isRequired={true}
            placeholder='Upload an JPG or PNG'
            name='profilePicture'
            onChange={handleFileChange}
          />
        </FormControl>
        <Button
          mt={10}
          colorScheme='teal'
          type='submit'
        >
          Generate Image
        </Button>
      </form>
    </Layout>
  )
}

export { GenerateImageForm }
