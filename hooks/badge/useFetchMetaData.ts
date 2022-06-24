import { useEffect, useState } from "react"

export interface TokenURIJSON {
  name: string
  image: string
  description: string
  attributes: any
}

export const useFetchTokenURIJSON = (badgeTokenURI: string | undefined) => {
  const [tokenURIJSON, setTokenURIJSON] = useState<TokenURIJSON>()
  useEffect(() => {
    const fetchTokenURIJSON = async (uri: string) => {
      const response = await fetch(uri)
      const data = await response.json()
      return data
    }

    if (badgeTokenURI) {
      fetchTokenURIJSON(badgeTokenURI).then(data => {
        setTokenURIJSON(data)
      })
    }
  }, [badgeTokenURI])
  return {
    tokenURIJSON
  }
}
