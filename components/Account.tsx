import { useAccount, useEnsName } from 'wagmi'
import { Text } from '@chakra-ui/react'

export default function Account() {
  const { data: accountData } = useAccount()
  const { data: ensNameData } = useEnsName({ address: accountData?.address })

  return (
    <Text fontSize='xs'>
      {ensNameData ?? accountData?.address}
      {ensNameData ? ` (${accountData?.address})` : null}
    </Text>
  )
}