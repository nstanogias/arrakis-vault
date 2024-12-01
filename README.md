This is a small NextJs app that allows users to deposit funds into an Arrakis vault

## How to run

- Install dependencies

```bash
npm istall
```

- Create a .env file with a project id NEXT_PUBLIC_PROJECT_ID that you can create from [here](https://cloud.reown.com/sign-in)

- Start the developmet server

```bash
npm run dev
```

## How to test

- There are e2e tests setup with [playwright](https://playwright.dev/). Its clear from each test description what the test is about.

```bash
npm run test
```

## Functional Requirements

- Wallet Connection using Rainbowkit
- Smart contract interaction
  - Read vault information
  - Read erc20 token balance
  - Read erc20 token allowance
  - Approve erc20 token
  - Add liquidity to the vault
- Responsive design
- Input Validation
- Error handling

## Smart contract addresses

- Arrakis helper: 0x89E4bE1F999E3a58D16096FBe405Fc2a1d7F07D6
- Arrakis router: 0x6aC8Bab8B775a03b8B72B2940251432442f61B94
- Arrakis resolver: 0x535c5fdf31477f799366df6e4899a12a801cc7b8
- Vault id: 0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723
