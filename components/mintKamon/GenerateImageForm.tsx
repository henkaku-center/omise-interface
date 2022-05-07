import { useAccount } from 'wagmi'
import { useState } from 'react'
import { Button, Heading, Text, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { Layout } from '@/components/layouts/layout'

const GenerateImageForm = () => {
  const ipfsApiEndpoint = 'https://api.staging.sakazuki.xyz/henkaku/ipfs'
  const { data } = useAccount()
  const [input, setInput] = useState('')
  const [disabled, setDisabled] = useState(false)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.files[0])
  const isError = input === ''

  const submitGenerateImage = async (event: any) => {
    event.preventDefault()
    setDisabled(true)
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

    const ipfsApiEndpointRequest = await fetch(
      ipfsApiEndpoint,
      {
        body: JSON.stringify(payLoad),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    )
    const ipfsApiEndpointResponse = await ipfsApiEndpointRequest.json()
    const tokenURI = ipfsApiEndpointResponse.tokenUri
    console.log('tokenURI', tokenURI)

    const pinataTokenUriRequest = await fetch(tokenURI)
    const tokenJson = await pinataTokenUriRequest.json()
    const tokenImageURI = tokenJson.image
    console.log('tokenJson', tokenJson)
    console.log('tokenImageURI', tokenImageURI)
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
          isDisabled={disabled}
        >
          Generate Image
        </Button>
      </form>
    </Layout>
  )
}

export { GenerateImageForm }
