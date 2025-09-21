import { createThirdwebClient } from "thirdweb";
import { inAppWallet } from "thirdweb/wallets";

// Initialize Thirdweb client
export const client = createThirdwebClient({
  clientId: "7c0b9a7d1f8a6e4c3b2a9d8e5f6c7b0a" // Replace with your actual client ID
});

// Configure supported wallets
export const wallets = [
  inAppWallet({
    auth: {
      options: [
        "email",
        "google",
        "discord",
        "github",
        "apple",
        "facebook"
      ]
    },
    metadata: {
      name: "Etherith Memory Vault",
      description: "Decentralized Memory Preservation Platform",
      image: {
        src: "/favicon.ico",
        width: 64,
        height: 64,
      },
    },
  }),
];

// Chain configuration (optional - defaults to Ethereum mainnet)
export const activeChain = "ethereum";