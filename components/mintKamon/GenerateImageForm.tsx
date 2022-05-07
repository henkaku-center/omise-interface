import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import {
  Button,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Box
} from '@chakra-ui/react'
import { Layout } from '@/components/layouts/layout'
import { useToast } from '@/hooks/useToast'

interface Token {
  name: string
  description: string
  image: string
  attributes: any[]
}

interface EventProps {
  event: {
    target: {
      value: string
    }
  }
}

interface Prop {
  onSetTokenURI: (value: string) => void
}

const GenerateImageForm: React.FC<Prop> = ({ onSetTokenURI }) => {
  const ipfsApiEndpoint = 'https://api.staging.sakazuki.xyz/henkaku/ipfs'
  const { toast } = useToast()
  const { data } = useAccount()
  const [name, setName] = useState<string>()
  const [imageFile, setImageFile] = useState<string>()
  const [imageFileObject, setImageFileObject] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const [tokenURIImage, setTokenImageURI] = useState<string>()

  const submitGenerateImage = async () => {
    if (!imageFile || !name || !imageFileObject) {
      let toastDescription: string = ''
      if (!name) {
        toastDescription += 'Please enter your name. '
      }
      if (!imageFile) {
        toastDescription += 'Please choose a profile picture. '
      } else if (!imageFileObject) {
        toastDescription += 'Your profile picture could not be correctly processed. '
      }
      toast({
        title: 'All fields are required',
        description: toastDescription,
        status: 'error'
      })
      return
    }
    setIsLoading(true)
    // this is debug purpose
    // setTokenImageURI(
    //   'https://pitpa.mypinata.cloud/ipfs/QmNndSLYnChANwhPBnj5AwB5M7XEWz5LwDbQsrXNLu89Gb'
    // )
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
      name,
      address: data?.address,
      roles: ['Community member'],
      points: 100,
      date: ~~(new Date().getTime() / 1000),
      profilePicture: await blobToBase64(imageFileObject)
    }

    const ipfsApiEndpointRequest = await fetch(ipfsApiEndpoint, {
      body: JSON.stringify(payLoad),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    const ipfsApiEndpointResponse = await ipfsApiEndpointRequest.json()
    const tokenURI = await ipfsApiEndpointResponse.tokenUri

    const pinataTokenUriRequest = await fetch(tokenURI)
    const responseJson = await pinataTokenUriRequest.json()
    const tokenImageURI = await responseJson.image
    if (tokenImageURI) {
      setTokenImageURI(tokenImageURI)
      return
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (tokenURIImage) {
      onSetTokenURI(tokenURIImage)
    }
  }, [tokenURIImage])

  console.log(imageFile)
  return (
    <Layout>
      <Heading as="h2" color="gray.600">
        Mint your Kamon - 家紋{' '}
      </Heading>
      <Text m="1rem">kamon NFT is membership of henkaku community</Text>
      <Box bg="whiteAlpha.900" p={6} borderRadius="lg" borderWidth="3px">
        <FormControl color="gray.700">
          <FormLabel>wallet address: </FormLabel>
          <Text fontSize="xs"> {data?.address} </Text>
          <FormControl isRequired mt={5}>
            <FormLabel htmlFor="name">Your name or nickname</FormLabel>
            <Input
              type="text"
              variant="outline"
              placeholder="Your name"
              name="name"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired mt={5}>
            <FormLabel htmlFor="imageFile">
              Your profile picture for the Kamon NFT
            </FormLabel>
            <Input
              variant="outline"
              id="imageFile"
              type="file"
              accept={'image/*'}
              isRequired={true}
              placeholder="Upload an JPG or PNG"
              name="profilePicture"
              value={imageFile}
              onChange={(e: any) => {
                setImageFile(e.target.value)
                setImageFileObject(e.target.files[0])
              }}
            />
          </FormControl>
          <Button
            mt={10}
            colorScheme="teal"
            type="submit"
            isLoading={isLoading}
            onClick={() => submitGenerateImage()}
          >
            Generate Image
          </Button>
        </FormControl>
      </Box>
    </Layout>
  )
}

export { GenerateImageForm }
