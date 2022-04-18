import type { NextPage } from 'next'
import { useAccount } from 'wagmi'

const Home: NextPage = () => {
  const [{ data, error, loading }, disconnect] = useAccount()

  return (
    <>
      <div>{data?.address}</div>
      <button onClick={disconnect}>
        Disconnect from {data?.connector?.name}
      </button>
    </>
  )
}

export default Home
