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
  address: string | undefined
}

const GenerateImageForm: React.FC<Prop> = ({ onSetTokenURI, address }) => {
  const ipfsApiEndpoint = 'https://api.staging.sakazuki.xyz/henkaku/ipfs'
  const { toast } = useToast()
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
        toastDescription +=
          'Your profile picture could not be correctly processed. '
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
      address: address,
      roles: ['Community member'],
      points: 100,
      date: ~~(new Date().getTime() / 1000),
      profilePicture: await blobToBase64(imageFileObject)
    }

    let ipfsApiEndpointRequest
    try {
      ipfsApiEndpointRequest = await fetch(ipfsApiEndpoint, {
        body: JSON.stringify(payLoad),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }).then((response) => {
        // 413 crashes before we can check ipfsApiEndpointRequest.status,
        // so it's dealt with here
        if (response.status == 413) throw new Error(response.status.toString())
        return response
      })
    } catch (error) {
      processHttpError(413)
      setIsLoading(false)
      return
    }
    processHttpError(ipfsApiEndpointRequest.status)
    const ipfsApiEndpointResponse = await ipfsApiEndpointRequest.json()
    const tokenURI = await ipfsApiEndpointResponse.tokenUri

    const pinataTokenUriRequest = await fetch(tokenURI)
    processHttpError(pinataTokenUriRequest.status)
    const responseJson = await pinataTokenUriRequest.json()
    const tokenImageURI = await responseJson.image
    if (tokenImageURI) {
      setTokenImageURI(tokenImageURI)
      return
    }
    setIsLoading(false)
  }

  const processHttpError = (status: number) => {
    const httpErrorMsd: number = ~~(status / 100)
    interface errorMessages {
      [key: string]: string
    }
    const httpErrorMessages: errorMessages = {
      error4: 'There was a problem with the request',
      error400: 'There probably was an error with the data you submitted.',
      error403: 'The server did not allow the request.',
      error404: 'The server did not know what to do with the request.',
      error413:
        'The request payload was too large. Please choose an image below 4 megabytes.',
      error5:
        'The server could not fulfill the request. Please try again later.',
      error500:
        'The server crashed and could not fulfill the request. Please try again later.'
    }
    if (httpErrorMsd > 3) {
      const propA: string = 'error' + status
      const propB: string = 'error' + httpErrorMsd
      let toastDescription: string
      if (httpErrorMessages.hasOwnProperty(propA)) {
        toastDescription = httpErrorMessages[propA]
      } else if (httpErrorMessages.hasOwnProperty(propB)) {
        toastDescription = httpErrorMessages[propB]
      } else {
        toastDescription = httpErrorMessages['error4']
      }
      toast({
        title: 'Error ' + status,
        description: toastDescription,
        status: 'error'
      })
      setIsLoading(false)
      return
    }
  }
  useEffect(() => {
    if (tokenURIImage) {
      onSetTokenURI(tokenURIImage)
    }
  }, [tokenURIImage])

  return (
    <Layout>
      <Heading as="h2" color="gray.600">
        Mint your Kamon - 家紋{' '}
      </Heading>
      <Text m="1rem">kamon NFT is membership of henkaku community</Text>
      <Box bg="whiteAlpha.900" p={6} borderRadius="lg" borderWidth="3px">
        <FormControl color="gray.700">
          <FormLabel>wallet address: </FormLabel>
          <Text fontSize="xs"> {address} </Text>
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
            loadingText='generating...'
          >
            Generate Image
          </Button>
        </FormControl>
      </Box>
    </Layout>
  )
}

export { GenerateImageForm }
