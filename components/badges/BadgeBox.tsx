import { Link, Box, Text, Badge, Image } from '@chakra-ui/react'
import { ethers } from 'ethers'
import useTranslation from 'next-translate/useTranslation'
import { displayValue } from '@/utils/bigNumber'
import { useFetchTokenURIJSON } from '@/hooks/badge/useFetchMetaData'
import { useEffect, useState } from 'react'

export const BadgeBox: React.FC<{
  badge: [boolean, boolean, ethers.BigNumber, ethers.BigNumber, string]
  tokenId: number
}> = (data) => {
  const [, , amount, maxSupply, tokenURI] = data.badge
  const { t } = useTranslation('common')
  const { tokenURIJSON } = useFetchTokenURIJSON(tokenURI)

  if (!tokenURIJSON) {
    return <></>
  }

  return (
    <Link href={`/badges/${data.tokenId}`}>
      <Box boxShadow="xs" p="6" rounded="md" bg="whiteAlpha.100">
        <Image mt={1} src={tokenURIJSON.image} alt={t('IMAGE_PREVIEW_ALT')} />
        <Badge variant="outline" colorScheme="green">
          Max Supply: {maxSupply.toString()}
        </Badge>
        <Badge variant="outline" colorScheme="green">
          {displayValue(amount)} $HENKAKU
        </Badge>
      </Box>
    </Link>
  )
}
