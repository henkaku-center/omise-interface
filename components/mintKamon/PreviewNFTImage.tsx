import { Box, Text, Badge, Image } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { Watermark } from '@hirohe/react-watermark'

interface Prop {
  imageUrl: string
}

export const PreviewNFTImage: React.FC<Prop> = ({ imageUrl }) => {
  const { t } = useTranslation('common')

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold">
        {t('IMAGE_PREVIEW')}
        <Badge ml={1} variant="outline" colorScheme="yellow">
          {t('IMAGE_PREVIEW_BADGE')}
        </Badge>
      </Text>
      <Watermark text="preview" gutter={20}>
        <Image mt={1} src={imageUrl} alt={t('IMAGE_PREVIEW_ALT')} />
      </Watermark>
    </Box>
  )
}
