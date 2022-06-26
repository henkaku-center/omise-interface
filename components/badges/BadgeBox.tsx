import { Link, Box, Button, Badge, Image } from '@chakra-ui/react'
import { ethers } from 'ethers'
import useTranslation from 'next-translate/useTranslation'
import { displayValue } from '@/utils/bigNumber'
import { useFetchTokenURIJSON } from '@/hooks/badge/useFetchMetaData'
import { useTotalSupply } from '@/hooks/badge/useTotalSupply'

export const BadgeBox: React.FC<{
  badge: [boolean, boolean, ethers.BigNumber, ethers.BigNumber, string]
  tokenId: number
  contractAddress: string
}> = (data) => {
  const [, , amount, maxSupply, tokenURI] = data.badge
  const { t } = useTranslation('common')
  const { totalSupply } = useTotalSupply(data.contractAddress, data.tokenId)
  const { tokenURIJSON } = useFetchTokenURIJSON(tokenURI)

  if (!tokenURIJSON) {
    return <></>
  }

  return (
    <Link href={`/badges/${data.tokenId}`}>
      <Box boxShadow="xs" p="6" rounded="md" bg="whiteAlpha.100">
        <Image mt={1} src={tokenURIJSON.image} alt={t('IMAGE_PREVIEW_ALT')} />
        <Badge variant="outline" colorScheme="green">
          Supply: {totalSupply?.toString()} / {maxSupply.toString()}
        </Badge>
        <Badge variant="outline" colorScheme="green">
          {displayValue(amount)} $HENKAKU
        </Badge>
        <Button mt="5" size="sm" colorScheme="teal">
          Mint this badge
        </Button>
      </Box>
    </Link>
  )
}
