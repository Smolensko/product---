// 火山引擎API测试脚本
const API_KEY = '7064a7b8-c6ff-4d4a-ae78-37bc8c6e7895';
const API_URL = 'https://ark.cn-beijing.volces.com/api/text/v1/chat/completions';

async function testAIAPI() {
  console.log('=== 火山引擎方舟大模型API测试 ===');
  console.log('API Key:', API_KEY);
  console.log('API URL:', API_URL);
  console.log('开始测试连接...\n');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'doubao-3.5-turbo',
        messages: [{ role: 'user', content: '你好，请用中文回复我' }],
        max_tokens: 50,
        temperature: 0.7
      })
    });

    console.log('HTTP状态码:', response.status);
    console.log('响应状态:', response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ API调用成功！');
      console.log('响应数据:', JSON.stringify(data, null, 2));
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        console.log('\n🎉 AI响应:', data.choices[0].message.content);
      } else if (data.result) {
        console.log('\n🎉 AI响应:', data.result);
      }
    } else {
      console.log('\n❌ API调用失败');
      try {
        const errorData = await response.json();
        console.log('错误详情:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        console.log('无法解析错误详情');
      }
    }
  } catch (error) {
    console.log('\n❌ 网络请求失败');
    console.log('错误类型:', error.name);
    console.log('错误信息:', error.message);
    
    if (error.name === 'TypeError' && error.message.includes('fetch failed')) {
      console.log('\n💡 可能原因：');
      console.log('1. 网络无法访问火山引擎API');
      console.log('2. API Key无效或已过期');
      console.log('3. 防火墙阻止了请求');
      console.log('4. 区域设置不正确（需要华北2区域）');
    }
  }
}

// 运行测试
testAIAPI();
