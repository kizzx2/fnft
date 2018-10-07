# FNFT (Fungible Non Fungible Tokens)

A wallet protocol and implementation to allow transferable [Fractional Ownership](https://en.wikipedia.org/wiki/Fractional_ownership) to be implemented for ERC721 tokens (NFTs).

## Motivation / Philosophy

People often want to co-own an NFT, as explained in the article linked above. Implementing this using a traditional multi-sig wallet is a logical next step but this proposal brings several important improvements in terms of further closing the gap between decentralized and centralized financila systems:

- As a Minority Owner (e.g. 20%), if the Majority decides to sell the NFT, I should still be entitled to 20% of the profit received.

- As a Shareholder, I would like to be able to freely adjust my stake in the free market / exchanges. Stakes into this ERC721 token under this scheme are ERC20 tokens. A multi-sig wallet does not offer this feature.

- We believe the above is an important step in enabling the creation portfolios of NFTs, such as using the [Set Protocol](https://setprotocol.com/)

- It is the logical next step in the evolution of a decentralized financial system. In the traditional financial system, high value items are rarely solely owned by 1 person.

## Features

- NFTs (ERC721) and their shares (ERC20) can be traded directly on DEX using [0x protocol](https://0xproject.com/) in FNFT Wallet.
- Create [Set](https://wallet.coinbase.com/) bundles of shares (ERC20) directly in the FNFT wallet.
- The whole ecosystem, including [0x Exchange contract](https://sokol.poaexplorer.com/txid/search/0x5b1986bd6a77fa04d9b964f778e9633639402520a048accabc247eeb67c3d441), ERC721 tokens and the FNFT wallet contract, has been deployed to the [POA Ethereum Network](https://poa.network/) testnet
- Works great with mobile wallets such as [Coinbase Wallet](https://wallet.coinbase.com/)

## Building

```
(cd truffle && npm i && truffle compile)
(cd dapp && yarn && yarn run start)
```
