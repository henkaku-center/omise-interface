import { Box, Text, Badge, Image } from '@chakra-ui/react'

interface Prop {
  imageUrl: string
}

export const PreviewNFTImage: React.FC<Prop> = ({ imageUrl }) => {
  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold">
        Preview Image
        <Badge ml={1} variant="outline" colorScheme="yellow">
          preview
        </Badge>
      </Text>
      <Image mt={1} boxSize="250px" src={imageUrl} alt="" />
    </Box>
  )
}
