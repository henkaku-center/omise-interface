import { Button, Heading } from "@chakra-ui/react"
import { Layout } from "../layouts/layout"

const GenerateImageForm = () => {
  return (
    <Layout>
      <Heading mt={50}>Henkaku kamon nft</Heading>
      <Button mt={10} colorScheme='teal'>
        generate Image
      </Button>
    </Layout>
  )
}

export { GenerateImageForm }