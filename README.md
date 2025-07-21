# Dwelp - Decentralized Document Verification Platform

Dwelp is a decentralized application that combats the growing issue of fake certificates, circulars, and degrees by enabling institutions to **digitally sign official PDFs** using blockchain. These documents can then be verified by anyone — no account, no login, no middleman.

Think of it as a **trustless**, **public notary** for the digital world.

## 🚀 How It Works

1. **Admin Dashboard (Issuer Portal)**
- Accessible **only by the deployer's wallet** (contract owner)
- Uploads and signs PDF documents using a **private key**
- Stores signed file data on **IPFS via Pinata**
- Saves the cryptographic signature and file hash on-chain
2. **Verification Portal (Public Portal)**
- Open to **any user without login**
- Anyone can upload a document and check if it’s an **officially signed** file
- Matches signature using the stored hash on-chain and public key from contract

## 💡 Why Dwelp?

"The institute will remain closed tomorrow!"<br>
We’ve all received such messages — some true, many fake.
Dwelp eliminates the doubt. With **on-chain signatures and IPFS storage**, official documents can be **verified instantly and trustlessly**.

## 🔐 Key Features

- Institutional PDF signing using private-public key cryptography
- Real-time blockchain-based signature verification
- Admin-only contract access via wallet-based control
- Tamper-proof document storage on IPFS (via Pinata)
- Public portal for open document verification
- Secure UI with RainbowKit and wallet login
- Fully decentralized architecture — no centralized backend
- Mobile-responsive and production-ready

## 🛠 Tech Stack

**Frontend**
- TypeScript · React · Tailwind CSS
- Wagmi · Viem · RainbowKit

**Smart Contracts & Infra**
- Solidity · Foundry
- Polygon Amoy (testnet)
- Infura RPC
- Pinata + IPFS for file storage
- OpenSSL + `crypto` module for PDF signing

## 📦 Installation & Setup
```bash
git clone https://github.com/yashgoel75/dwelp.git
cd dwelp
npm install
```

Create a `.env` file:
```env
PINATA_API_KEY=YOUR_PINATA_API_KEY
PINATA_API_SECRET=YOUR_PINATA_API_SECRET
PINATA_JWT=YOUR_PINATA_JWT
NEXT_PUBLIC_GATEWAY_URL=YOUR_PUBLIC_GATEWAY_URL
PRIVATE_KEY=YOUR_OPENSSL_PRIVATE_KEY
PUBLIC_KEY=YOUR_OPENSSL_PUBLIC_KEY
```

Run the dev server:
```bash
npm run dev
```

## 🧠 Lessons Learned
- Implementing cryptographic signing with `OpenSSL` and Web3 was challenging but rewarding.
- Working with **Polygon Amoy** testnet was a first — it revealed edge cases around RPC reliability and gas optimizations.
- Designing a **truly decentralized**, **login-free verification system** pushed me to rethink typical app architecture.

## 🗣 Feedback
This is an open project — feedback, bug reports, and improvements are welcome!
If you're building something similar or want to integrate document verification into your org, feel free to reach out.

Trust shouldn't be assumed — it should be verifiable.<br>
Dwelp brings that belief to life, one document at a time.