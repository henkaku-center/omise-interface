import type { NextPage } from 'next'
import { useAccount, useNetwork, useConnect } from 'wagmi'
import { Button, Heading } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Layout } from '@/components/layouts/layout'
import { GenerateImageForm } from '@/components/mintKamon/GenerateImageForm'
import { useMounted } from '@/hooks/useMounted'
import {
  APPROVE_CALLBACK_STATUS,
  useApproval,
  useApprove,
} from '@/hooks/useApproval'
import { getContractAddress } from '@/utils/contractAddress'

const MintKamon: NextPage = () => {
  const mounted = useMounted()
  const { activeChain } = useNetwork()
  const { data } = useAccount()
  const { connect, connectors, error} = useConnect()
  const [metaMask] = connectors
  const henkakuErc20 = getContractAddress({
    name: 'henkakuErc20',
    chainId: activeChain?.id,
  })
  const kamonNFT = getContractAddress({
    name: 'kamonNFT',
    chainId: activeChain?.id,
  })
  const { status, approve } = useApprove(henkakuErc20, kamonNFT)
  const approved = useApproval(henkakuErc20, kamonNFT)
  const [tokenURI, setTokenURI] = useState('')

  useEffect(() => {
    setTokenURI('httsp://yourtokenURI') // TODO: for enable and mintWithHenkaku method
  }, [])

  if (false && !tokenURI) {
    return <GenerateImageForm />
  }

  return (
    <>
      <Layout>
        <Heading mt={50}>Henkaku kamon nft</Heading>
        {mounted && data?.address}
        {mounted && !data?.address && (
          <Button colorScheme='teal' onClick={() => connect(metaMask)}>
            connect wallet
          </Button>
        )}

        {error && <div>{error.message}</div>}
        {mounted &&
          data?.address &&
          (tokenURI && approved ? (
            <Button mt={10} colorScheme='teal'>
              Mint with 1000 henkaku
            </Button>
          ) : (
            <Button
              mt={10}
              colorScheme='teal'
              onClick={approve}
              isLoading={status == APPROVE_CALLBACK_STATUS.PENDING}
            >
              enable to get kamon nft
            </Button>
          ))}
      </Layout>
    </>
  )
}

export default MintKamon
