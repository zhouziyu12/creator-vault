import { SEPOLIA_CONFIG } from './config';

// 查询 Sepolia ETH 余额
export async function getSepoliaBalance(address: string): Promise<string> {
  try {
    const response = await fetch(SEPOLIA_CONFIG.rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    // 将 Wei 转换为 ETH
    const balanceWei = BigInt(data.result);
    const balanceEth = Number(balanceWei) / Math.pow(10, 18);
    
    return balanceEth.toString();
  } catch (error) {
    console.error('获取余额失败:', error);
    return '0';
  }
}

// 获取交易历史
export async function getTransactionHistory(address: string): Promise<any[]> {
  try {
    // 使用 Etherscan API 获取交易历史
    const apiKey = 'YourEtherscanAPIKey'; // 需要申请 Etherscan API key
    const response = await fetch(
      `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status === '1') {
      return data.result.slice(0, 10); // 返回最新的 10 笔交易
    }
    
    return [];
  } catch (error) {
    console.error('获取交易历史失败:', error);
    return [];
  }
}
