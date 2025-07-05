// Sepolia ETH 真实钱包服务
export class SepoliaWalletService {
  private rpcUrl = 'https://sepolia.infura.io/v3/315dbedded6b4b37a95b73281cb81e22';
  
  // 获取 ETH 余额
  async getBalance(address: string): Promise<string> {
    try {
      const response = await fetch(this.rpcUrl, {
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
      if (data.result) {
        // 转换 wei 到 ETH
        const weiBalance = BigInt(data.result);
        const ethBalance = Number(weiBalance) / 1e18;
        return ethBalance.toFixed(6);
      }
      return '0.000000';
    } catch (error) {
      console.error('获取余额失败:', error);
      return '0.000000';
    }
  }
  
  // 获取交易历史
  async getTransactionHistory(address: string): Promise<any[]> {
    try {
      // 使用 Etherscan API 获取交易历史
      const etherscanApi = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=YourApiKeyToken`;
      
      const response = await fetch(etherscanApi);
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return data.result.slice(0, 10); // 最近10笔交易
      }
      return [];
    } catch (error) {
      console.error('获取交易历史失败:', error);
      return [];
    }
  }
  
  // 发送 ETH (需要私钥签名)
  async sendTransaction(to: string, amount: string, privateKey?: string) {
    // 注意：实际实现需要安全的私钥管理
    // 这里只是示例结构
    console.log('发送交易:', { to, amount });
    
    try {
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_sendTransaction',
          params: [{
            to,
            value: `0x${(parseFloat(amount) * 1e18).toString(16)}`,
            gas: '0x5208', // 21000 gas for ETH transfer
          }],
          id: 1,
        }),
      });
      
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('发送交易失败:', error);
      throw error;
    }
  }
  
  // 格式化地址显示
  formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  
  // 获取 Etherscan 链接
  getEtherscanUrl(address: string): string {
    return `https://sepolia.etherscan.io/address/${address}`;
  }
  
  // 获取交易链接
  getTxUrl(txHash: string): string {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  }
}

export const sepoliaWallet = new SepoliaWalletService();
