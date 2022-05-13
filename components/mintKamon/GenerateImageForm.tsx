import { useState } from 'react'
import {
  Button,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Box
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { Layout } from '@/components/layouts/layout'
import { useToast } from '@/hooks/useToast'
import {
  blobToBase64,
  formError,
  httpErrorMessages
} from './generateImageFormHelper'

interface Prop {
  onSetTokenURI: (value: string) => void
  onSetTokenImageURI: (value: string) => void
  address: string | undefined
}

const GenerateImageForm: React.FC<Prop> = ({
  onSetTokenURI,
  onSetTokenImageURI,
  address
}) => {
  const { t } = useTranslation('common')
  const ipfsApiEndpoint = process.env.NEXT_PUBLIC_IPFS_API_URI + ''
  const [name, setName] = useState<string>()
  const [imageFile, setImageFile] = useState<string>()
  const [imageFileObject, setImageFileObject] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const processHttpError = (status: number) => {
    const httpErrorMsd: number = ~~(status / 100)
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

  const submitGenerateImage = async () => {
    if (!imageFile || !name || !imageFileObject) {
      toast({
        title: 'All fields are required',
        description: formError({ name, imageFile, imageFileObject }),
        status: 'error'
      })
      return
    }
    setIsLoading(true)
    // this is debug purpose
    // onSetTokenImageURI(
    //   'https://pitpa.mypinata.cloud/ipfs/QmNndSLYnChANwhPBnj5AwB5M7XEWz5LwDbQsrXNLu89Gb'
    // )
    // onSetTokenURI(
    //   'https://pitpa.mypinata.cloud/ipfs/QmNndSLYnChANwhPBnj5AwB5M7XEWz5LwDbQsrXNLu89Gb'
    // )

    const payLoad = {
      name,
      address: address,
      roles: ['Community member'],
      points: 0,
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
      onSetTokenImageURI(tokenImageURI)
    }
    if (tokenURI) {
      onSetTokenURI(tokenURI)
    }
    setIsLoading(false)
  }

  return (
    <Layout>
      <Heading as="h2" color="white.600">
        {t('MINT_YOUR_KAMON_HEADING')}{' '}
      </Heading>
      <Text m="1rem">{t('MINT_YOUR_KAMON_EXPLANATION')}</Text>
      <Box bg="Gray.800" p={6} borderRadius="lg" borderWidth="3px">
        <FormControl color="white.700">
          <FormLabel>{t('FORM_LABEL_WALLET_ADDRESS')}</FormLabel>
          <Text fontSize="xs"> {address} </Text>
          <FormControl isRequired mt={5}>
            <FormLabel htmlFor="name">{t('FORM_LABEL_NAME_NICKNAME')}</FormLabel>
            <Input
              type="text"
              variant="outline"
              placeholder={t('FORM_LABEL_NAME_NICKNAME_PLACEHOLDER')}
              name="name"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired mt={5}>
            <FormLabel htmlFor="imageFile">
              {t('FORM_LABEL_PFP')}
            </FormLabel>
            <Input
              variant="outline"
              id="imageFile"
              type="file"
              accept={'image/*'}
              isRequired={true}
              placeholder={t('FORM_LABEL_PFP_PLACEHOLDER')}
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
            loadingText={t('GENERATE_IMAGE_BUTTON_LOADING')}
          >
            {t('GENERATE_IMAGE_BUTTON')}
          </Button>
        </FormControl>
      </Box>
    </Layout>
  )
}

export { GenerateImageForm }
