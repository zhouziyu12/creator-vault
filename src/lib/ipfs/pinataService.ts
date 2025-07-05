// 强化的 Pinata IPFS 服务
export interface PinataUploadResult {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class PinataService {
  private readonly API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY!;
  private readonly SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!;
  private readonly JWT = process.env.NEXT_PUBLIC_PINATA_JWT!;
  private readonly GATEWAY_URL = 'https://gateway.pinata.cloud/ipfs/';

  constructor() {
    if (!this.API_KEY || !this.SECRET_KEY || !this.JWT) {
      console.error('Pinata credentials not found in environment variables');
    }
  }

  // 测试API连接
  async testAuthentication(): Promise<boolean> {
    try {
      const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
        method: 'GET',
        headers: {
          'pinata_api_key': this.API_KEY,
          'pinata_secret_api_key': this.SECRET_KEY,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Pinata authentication successful:', result);
        return true;
      } else {
        console.error('Pinata authentication failed:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Pinata authentication error:', error);
      return false;
    }
  }

  // 上传文件到IPFS
  async uploadFile(
    file: File, 
    metadata?: any,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<PinataUploadResult> {
    
    // 首先测试认证
    const isAuthenticated = await this.testAuthentication();
    if (!isAuthenticated) {
      throw new Error('Pinata authentication failed');
    }

    const formData = new FormData();
    formData.append('file', file);

    // 添加元数据
    const pinataMetadata = {
      name: file.name,
      keyvalues: {
        platform: 'CreatorVault',
        uploadedAt: new Date().toISOString(),
        fileType: file.type,
        fileSize: file.size.toString(),
        ...metadata
      }
    };
    formData.append('pinataMetadata', JSON.stringify(pinataMetadata));

    // 添加固定选项
    const pinataOptions = {
      cidVersion: 1,
      wrapWithDirectory: false
    };
    formData.append('pinataOptions', JSON.stringify(pinataOptions));

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.JWT}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`IPFS upload failed: ${response.status} ${errorText}`);
      }

      const result: PinataUploadResult = await response.json();
      
      console.log('IPFS upload successful:', {
        hash: result.IpfsHash,
        size: result.PinSize,
        url: this.getGatewayUrl(result.IpfsHash)
      });

      return result;
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw error;
    }
  }

  // 上传JSON数据到IPFS
  async uploadJSON(data: any, filename = 'data.json'): Promise<PinataUploadResult> {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], filename, { type: 'application/json' });
    
    return this.uploadFile(file, { 
      contentType: 'json',
      description: 'CreatorVault metadata'
    });
  }

  // 获取IPFS网关URL
  getGatewayUrl(ipfsHash: string): string {
    return `${this.GATEWAY_URL}${ipfsHash}`;
  }

  // 获取Pinata专用网关URL（更快）
  getPinataUrl(ipfsHash: string): string {
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  }

  // 获取固定的文件列表
  async getPinnedFiles(limit = 10): Promise<any[]> {
    try {
      const response = await fetch(`https://api.pinata.cloud/data/pinList?status=pinned&pageLimit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.JWT}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        return result.rows || [];
      } else {
        throw new Error(`Failed to get pinned files: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Get pinned files error:', error);
      return [];
    }
  }

  // 取消固定文件
  async unpinFile(ipfsHash: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${ipfsHash}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.JWT}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Unpin file error:', error);
      return false;
    }
  }

  // 获取账户使用情况
  async getUsageStats(): Promise<any> {
    try {
      const response = await fetch('https://api.pinata.cloud/data/userPinnedDataTotal', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.JWT}`,
        },
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to get usage stats: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Get usage stats error:', error);
      return null;
    }
  }
}

export const pinataService = new PinataService();
