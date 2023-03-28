import { Link, Box, Button, Badge, Image } from '@chakra-ui/react'
import { ethers } from 'ethers'
import useTranslation from 'next-translate/useTranslation'
import { displayValue } from '@/utils/bigNumber'
import { useFetchTokenURIJSON } from '@/hooks/badge/useFetchMetaData'
import { useTotalSupply } from '@/hooks/badge/useTotalSupply'
import { useBadges } from '@/hooks/badge/useBadges'

type BadgeItem = {
  tokenId: number
  mintable: boolean
  transferable: boolean
  amount: ethers.BigNumber
  maxSupply: ethers.BigNumber
  tokenURI: string
}

export const BadgeBox: React.FC<{
  badge: BadgeItem
  contractAddress: string
  prefix?: string
}> = (data) => {
  const { tokenId, mintable, transferable, amount, maxSupply, tokenURI } =
    data.badge
  const { t } = useTranslation('common')
  const { totalSupply } = useTotalSupply(data.contractAddress, tokenId)

  const { tokenURIJSON } = useFetchTokenURIJSON(tokenURI)

  if (!tokenURIJSON) {
    return <></>
  }

  const inventory = Number(maxSupply) - Number(totalSupply)

  if (inventory <= 0) {
    return (
      <Box boxShadow="xs" p="6" rounded="md" bg="whiteAlpha.100">
        <Image
          boxSize="124px"
          mt={1}
          mb={2}
          src={tokenURIJSON.image}
          alt={t('IMAGE_PREVIEW_ALT')}
        />
        <Badge variant="outline" colorScheme="green">
          {displayValue(amount)} $HENKAKU
        </Badge>
        <Badge variant="outline" colorScheme="green">
          Supply: {inventory.toString()} / {maxSupply.toString()}
        </Badge>
        <Button
          mt="5"
          size="sm"
          colorScheme="red"
          variant="outline"
          isDisabled={true}
        >
          SOLD OUT
        </Button>
      </Box>
    )
  }
  return (
    <Link
      href={data.prefix ? `/${data.prefix}/${tokenId}` : `/badges/${tokenId}`}
    >
      <Box boxShadow="xs" p="6" rounded="md" bg="whiteAlpha.100">
        <Image
          boxSize="124px"
          mt={1}
          mb={2}
          src={tokenURIJSON.image}
          alt={t('IMAGE_PREVIEW_ALT')}
        />
        <Badge variant="outline" colorScheme="green">
          {displayValue(amount)} $HENKAKU
        </Badge>
        <Badge variant="outline" colorScheme="green">
          Supply: {inventory.toString()} / {maxSupply.toString()}
        </Badge>
        {mintable ? (
          <Button mt="5" size="sm" colorScheme="teal">
            Mint this badge
          </Button>
        ) : (
          <Button mt="5" size="sm" variant="outline">
            Not available
          </Button>
        )}
      </Box>
    </Link>
  )
}
