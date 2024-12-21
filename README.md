# 🌟 TokenStash

A decentralized application (DApp) for staking ERC20 tokens and earning rewards using smart contracts on the Ethereum blockchain.

## 📚 Overview

This project implements a staking mechanism where users can:
- Stake their ERC20 tokens
- Earn rewards over time
- Claim accumulated rewards
- Withdraw their staked tokens

Built with Next.js 13+ and smart contracts deployed on Ethereum, the DApp provides a seamless user experience for token staking operations.

## 🚀 Features

- **Token Staking**: Stake your ERC20 tokens
- **Reward System**: Earn rewards based on staking duration and amount
- **Real-time Updates**: View your staked amount and earned rewards in real-time
- **User-friendly Interface**: Clean and intuitive UI with proper error handling
- **Wallet Integration**: Seamless connection with Web3 wallets
- **Transaction Notifications**: Real-time feedback for all blockchain transactions

## 🛠 Technology Stack

- **Frontend**:
  - Next.js 13+
  - React
  - Ethers.js
  - TailwindCSS
  - shadcn/ui

- **Smart Contracts**:
  - Solidity
  - OpenZeppelin Contracts

## 📦 Installation

1. Clone the repository:
```bash
git clone <[repository-ur](https://github.com/Rabeet8/TokenStash.git)l>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```
3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

## 🔧 Smart Contract Setup

The DApp interacts with the following smart contracts:

1. **Staking Contract**: Handles staking operations and reward distribution
2. **Token Contract**: ERC20 token that can be staked

## 💻 Usage

1. **Connect Wallet**:
   - Click the "Connect Wallet" button
   - Approve the connection in your Web3 wallet
2. **Approving Token**
   - Enter the amount you want to approve
   - Click "Approve Tokens"

3. **Staking**:
   - Enter the amount you want to stake
   - Click "Stake Tokens"

4. **Claiming Rewards**:
   - View your earned rewards
   - Click "Claim Rewards" to receive them
   - Confirm the transaction in your wallet

5. **Withdrawing**:
   - Enter the amount to withdraw
   - Click "Withdraw"
   - Confirm the transaction

## ⚠️ Important Notes

- Make sure you have enough tokens and ETH for gas fees
- Staking requires two transactions: approve and stake
- Rewards are calculated per second
- Contract interactions may take a few moments to process

## 🔒 Security

- Smart contracts are based on OpenZeppelin's battle-tested contracts
- Proper input validation and error handling
- Transaction signing requirements for all operations

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit: `git commit -m 'Add some feature'`
5. Push: `git push origin feature/your-feature`
6. Submit a Pull Request

## 📄 Build By Syed Rabeet

