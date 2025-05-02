# Zend - Token Migration dApp

Zend is a decentralized application (dApp) built on Next.js that facilitates the migration of tokens from an old contract to a new one. This migration platform provides a user-friendly interface for both token holders and administrators.

## Features

- **Token Migration**: Users can migrate their old tokens to the new token contract
- **Real-time Countdown**: Visual countdown showing the time remaining for migration
- **Admin Panel**: Admin-specific functionality to fund the contract with new tokens and extend migration periods
- **Wallet Integration**: Seamless wallet connection using @reown/appkit and wagmi

## Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Web3 Integration**: wagmi, viem, ethers
- **UI Components**: Custom components with TailwindCSS
- **Notifications**: Sonner toast notifications

## Smart Contract Features

The dApp interacts with a token migration smart contract that includes:

- Token migration with time constraints
- Owner-only functions for funding and extending migration periods
- Migration status tracking

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MetaMask or other Web3 wallet

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd zend
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

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### User Flow

1. Connect your Web3 wallet using the "Connect" button
2. If you have old tokens, the application will display your balance
3. Click "Migrate" to start the migration process
4. Confirm the transaction in your wallet
5. Once confirmed, your new tokens will be available in your wallet

### Admin Flow

1. Connect using an admin wallet (contract owner)
2. Switch to the "Admin" tab
3. Use the "Fund" section to add new tokens to the migration contract
4. Use the "Extend" section to increase the migration period by specifying days

## Environment Variables

To run this project, you'll need to add the following environment variables to your `.env.local` file:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

## Building for Production

```bash
npm run build
# or
yarn build
```

## Deployment

The application can be deployed using Vercel, Netlify, or any other Next.js compatible hosting service.

```bash
npm run build
npm run start
```

## License

[MIT](LICENSE)

## Contact

For questions and support, please open an issue in the repository.
