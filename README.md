# Ether Wrap/Unwrap

This project is a decentralized application (dApp) that allows users to seamlessly wrap ETH (Ethereum) into WETH (Wrapped Ethereum) and unwrap WETH back into ETH. The application leverages the MetaMask wallet for user authentication and transaction signing, providing a user-friendly interface for interacting with the Ethereum blockchain.

## Technologies Used:

-   React+Vite: For building the user interface.
-   ethers.js: For interacting with the Ethereum blockchain and MetaMask.
-   Axios: For fetching real-time prices.
-   SCSS: For styling the components and enhancing the user experience.

## How It Works:

1. Users connect their MetaMask wallet to the application.
2. Enter the amount of ETH to wrap into WETH or the amount of WETH to unwrap back into ETH.
3. Confirm the transaction to wrap or unwrap the specified amount of tokens in MetaMask.
4. Check updated balances and prices directly within the app.

## Architecture:

1. Components:

-   App: The main component of the application. Manages the wallet connection and renders the WalletConnector and WrapUnwrap components.
-   WalletConnector: Component for connecting to the MetaMask wallet. Uses ethers.js to get the address of the connected wallet.Passes the connected signer to the App component through the onConnect function.
-   WrapUnwrap: Component for wrapping ETH to WETH and unwrapping WETH to ETH. Displays the user's ETH and WETH balances. Uses ERC20 contracts to perform deposit and withdraw operations.

2. const.ts

-   This file contains information about the token address and standard ERC20 contract ABI

## Installation:

Install Dependencies:

```bash
npm install
```

Start for development:

```bash
npm run dev
```

Build for Production:

```bash
npm run build
```
