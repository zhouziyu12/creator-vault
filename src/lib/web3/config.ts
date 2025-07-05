// Civic Auth Web3 配置
export const SEPOLIA_CHAIN_ID = 11155111;
export const MAINNET_CHAIN_ID = 1;

// 网络配置
export const NETWORKS = {
  sepolia: {
    chainId: SEPOLIA_CHAIN_ID,
    name: 'Sepolia Test Network',
    rpcUrl: 'https://sepolia.infura.io/v3/315dbedded6b4b37a95b73281cb81e22',
    blockExplorer: 'https://sepolia.etherscan.io',
    currency: 'SepoliaETH',
    faucet: 'https://sepoliafaucet.com/',
  },
  mainnet: {
    chainId: MAINNET_CHAIN_ID,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/315dbedded6b4b37a95b73281cb81e22',
    blockExplorer: 'https://etherscan.io',
    currency: 'ETH',
  }
};

// 默认使用 Sepolia 测试网
export const DEFAULT_NETWORK = NETWORKS.sepolia;
