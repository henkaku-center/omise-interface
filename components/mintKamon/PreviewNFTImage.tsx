import { Box, Text, Badge, Image } from '@chakra-ui/react'
import { Watermark } from '@hirohe/react-watermark';

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
      <Watermark text="preview" gutter={20}>
        <Image mt={1} src={imageUrl} alt="" />
      </Watermark>

    </Box>
  )
}
