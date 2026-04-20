// AI服务工具 - 通过后端代理调用火山引擎API（解决CORS跨域问题）

// 后端代理API地址
const API_URL = '/api/ai/extract';

// AI提取结果类型
export interface AIResult {
  // 人物相关
  birthYear?: string;
  deathYear?: string;
  dynasty?: string;
  role?: string;
  alias?: string;
  
  // 事件相关
  location?: string;
  category?: string;
  figures?: string[];
  year?: string;
  
  // 朝代相关
  capital?: string;
  period?: string;
  achievements?: string[];
}

// 使用AI提取信息（通过后端代理）
export const extractWithAI = async (text: string, searchMode: string): Promise<AIResult | null> => {
  try {
    console.log('开始AI智能提取...');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        searchMode: searchMode
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('AI代理API请求失败:', response.status, errorData);
      return null;
    }
    
    const data = await response.json();
    
    if (data.success && data.data) {
      console.log('AI提取成功:', data.data);
      return data.data;
    } else {
      console.error('AI提取失败:', data.error);
      return null;
    }
  } catch (error) {
    console.error('AI提取失败:', error);
    return null;
  }
};

// 测试AI服务
export const testAIConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/ai/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: '测试连接',
        searchMode: '人物'
      })
    });
    
    return response.ok;
  } catch {
    return false;
  }
};
