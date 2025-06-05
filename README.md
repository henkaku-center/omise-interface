# Membership NFT Interface

This project provides a web interface for minting and managing Henkaku membership NFTs and event badges. It is built with [Next.js](https://nextjs.org/) and [Chakra UI](https://chakra-ui.com/). Blockchain interactions are handled via [wagmi](https://wagmi.sh/) and [ethers.js](https://docs.ethers.io/).

## Features

- Mint your own **Kamon NFT** with a custom image
- Claim and migrate `$HENKAKU` tokens
- Collect and mint event **badges**
- Quest page to update your token metadata
- MetaMask support using wagmi
- English and Japanese localisation powered by `next-translate`
- Unit tests with Jest and end‑to‑end tests with Cypress

## Getting Started

1. Install dependencies
   ```bash
   yarn install
   ```
2. Copy `.env.sample` to `.env` and fill in the required values:
   - `NEXT_PUBLIC_IPFS_API_URI`
   - `NEXT_PUBLIC_IPFS_API_URI_STAGING`
   - `NEXT_PUBLIC_ALCHEMY_API_KEY`
   - (values for Cypress testing are optional)
3. Start the development server
   ```bash
   yarn dev
   ```
4. Open <http://localhost:3000> in your browser.

To create a production build run:
```bash
yarn build
```
And start it with:
```bash
yarn start
```

## Testing

Run unit tests:
```bash
CI=true yarn test
```

Run Cypress tests:
```bash
yarn e2e
```

## License

MIT
