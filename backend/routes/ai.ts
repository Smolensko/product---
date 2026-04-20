import { Router } from 'express';

const router = Router();

// 火山引擎API配置 - 方舟大模型API
const API_KEY = '7064a7b8-c6ff-4d4a-ae78-37bc8c6e7895';
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/responses';

// GET版本用于测试
router.get('/extract', (req, res) => {
  console.log('GET /api/ai/extract 被调用');
  res.json({ success: true, message: 'GET请求成功！POST请求需要在搜索时触发' });
});

router.post('/extract', async (req, res) => {
  try {
    const { text, searchMode } = req.body;

    if (!text) {
      return res.status(400).json({ error: '请提供文本内容' });
    }

    let prompt = '';

    if (searchMode === '事件') {
      prompt = `请从以下历史事件文本中提取关键信息，以JSON格式输出，字段包括：
      - location: 事件发生地点（字符串）
      - category: 事件类别，如战争、起义、事变、革命、改革等（字符串）
      - figures: 相关人物列表（数组）
      - year: 事件发生时间范围（字符串，如"755年 - 763年"）
      
      如果无法提取到某个字段，请返回空字符串或空数组。
      
      文本：${text}`;
    } else if (searchMode === '人物') {
      prompt = `请从以下历史人物文本中提取关键信息，以JSON格式输出，字段包括：
      - birthYear: 出生年份（字符串，如"701年"）
      - deathYear: 逝世年份（字符串，如"762年"）
      - dynasty: 所属朝代（字符串，如"唐朝"）
      - role: 身份职位（字符串，如"诗人"）
      - alias: 别名称号（字符串）
      
      如果无法提取到某个字段，请返回空字符串。
      
      文本：${text}`;
    } else if (searchMode === '政权' || searchMode === '时期') {
      prompt = `请从以下朝代/政权文本中提取关键信息，以JSON格式输出，字段包括：
      - capital: 都城（字符串，如"长安"）
      - period: 存在时间范围（字符串，如"618年 - 907年"）
      - achievements: 主要成就列表（数组）
      
      如果无法提取到某个字段，请返回空字符串或空数组。
      
      文本：${text}`;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'doubao-seed-1-8-251228',
        input: {
          role: 'user',
          content: [ 
          {
            type: 'input_text', // 固定值，标识文本输入
            text: prompt // 你的prompt字符串放在这里
          }
        ]
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('火山引擎API请求失败:', response.status, errorData);
      return res.status(response.status).json({ 
        error: 'AI服务暂时不可用',
        details: errorData 
      });
    }

    const data = await response.json();
    const resultText = data.output?.content || data.result || '';

    if (!resultText) {
      return res.status(500).json({ error: '未获取到AI响应内容' });
    }

    try {
      // 清理可能的markdown格式
      const cleanedText = resultText.replace(/```json\n?/g, '').replace(/\n?```/g, '').trim();
      const parsedResult = JSON.parse(cleanedText);
      res.json({ success: true, data: parsedResult });
    } catch (parseError) {
      console.error('AI结果解析失败:', parseError);
      console.log('原始响应:', resultText);
      res.status(500).json({ error: 'AI响应解析失败', rawResponse: resultText });
    }
  } catch (error) {
    console.error('AI代理错误:', error);
    res.status(500).json({ error: 'AI服务调用失败', details: error.message });
  }
});

export default router;
