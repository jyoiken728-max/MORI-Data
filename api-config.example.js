/**
 * API配置示例文件
 * 
 * 使用说明：
 * 1. 将此文件复制为 api-config.js
 * 2. 填入真实的API端点URL和认证信息
 * 3. 在 index.html 中引入 api-config.js 替换模拟数据
 */

const apiConfig = {
  // API端点配置
  baseURL: 'https://api.example.com/v1',  // 替换为实际的API基础URL
  
  // 传感器数据端点
  endpoints: {
    // 获取当前传感器数据
    currentData: '/sensors/current',
    
    // 获取历史传感器数据
    // 参数: ?start=YYYY-MM-DDTHH:mm:ss&end=YYYY-MM-DDTHH:mm:ss
    historicalData: '/sensors/historical'
  },
  
  // 认证配置
  authentication: {
    // API密钥方式
    apiKey: 'YOUR_API_KEY_HERE',
    headerName: 'X-API-Key',  // API密钥的HTTP头名称
    
    // 或者使用Bearer Token方式
    // bearerToken: 'YOUR_BEARER_TOKEN_HERE',
    
    // 或者使用基本认证
    // basicAuth: {
    //   username: 'YOUR_USERNAME',
    //   password: 'YOUR_PASSWORD'
    // }
  },
  
  // 请求配置
  requestConfig: {
    timeout: 10000,  // 请求超时时间（毫秒）
    retryAttempts: 3,  // 重试次数
    retryDelay: 1000   // 重试延迟（毫秒）
  },
  
  // 数据更新频率（毫秒）
  updateInterval: 30000,  // 30秒更新一次
  
  // 是否使用模拟数据（开发/测试时设为true）
  useMockData: false
};

/**
 * 构建请求头
 */
function buildRequestHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  // 添加API密钥
  if (apiConfig.authentication.apiKey) {
    headers[apiConfig.authentication.headerName] = apiConfig.authentication.apiKey;
  }
  
  // 或者添加Bearer Token
  // if (apiConfig.authentication.bearerToken) {
  //   headers['Authorization'] = `Bearer ${apiConfig.authentication.bearerToken}`;
  // }
  
  // 或者添加基本认证
  // if (apiConfig.authentication.basicAuth) {
  //   const credentials = btoa(
  //     `${apiConfig.authentication.basicAuth.username}:${apiConfig.authentication.basicAuth.password}`
  //   );
  //   headers['Authorization'] = `Basic ${credentials}`;
  // }
  
  return headers;
}

/**
 * 获取当前传感器数据
 * @returns {Promise<Object>} 传感器数据对象
 */
async function fetchCurrentSensorData() {
  if (apiConfig.useMockData) {
    // 使用模拟数据
    return generateMockSensorData();
  }
  
  try {
    const url = `${apiConfig.baseURL}${apiConfig.endpoints.currentData}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: buildRequestHeaders(),
      signal: AbortSignal.timeout(apiConfig.requestConfig.timeout)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 转换API响应数据格式（根据实际API调整）
    return {
      timestamp: data.timestamp || new Date().toISOString(),
      temperature: parseFloat(data.temperature),
      humidity: parseFloat(data.humidity),
      rainfall: parseFloat(data.rainfall || 0),
      windSpeed: parseFloat(data.windSpeed || data.wind_speed),
      maxWindSpeed: parseFloat(data.maxWindSpeed || data.max_wind_speed || data.windSpeed),
      windDirection: parseFloat(data.windDirection || data.wind_direction),
      solarRadiation: parseFloat(data.solarRadiation || data.solar_radiation),
      uvIndex: parseFloat(data.uvIndex || data.uv_index)
    };
  } catch (error) {
    console.error('获取传感器数据失败:', error);
    throw error;
  }
}

/**
 * 获取历史传感器数据
 * @param {Date} startDate - 开始时间
 * @param {Date} endDate - 结束时间
 * @returns {Promise<Array>} 历史数据数组
 */
async function fetchHistoricalSensorData(startDate, endDate) {
  if (apiConfig.useMockData) {
    // 使用模拟数据
    const count = Math.ceil((endDate - startDate) / (5 * 60 * 1000)); // 每5分钟一个数据点
    return generateHistoricalData(count, 5);
  }
  
  try {
    const startStr = startDate.toISOString();
    const endStr = endDate.toISOString();
    const url = `${apiConfig.baseURL}${apiConfig.endpoints.historicalData}?start=${startStr}&end=${endStr}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: buildRequestHeaders(),
      signal: AbortSignal.timeout(apiConfig.requestConfig.timeout)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 转换API响应数据格式（根据实际API调整）
    return data.map(item => ({
      timestamp: item.timestamp,
      temperature: parseFloat(item.temperature),
      humidity: parseFloat(item.humidity),
      rainfall: parseFloat(item.rainfall || 0),
      windSpeed: parseFloat(item.windSpeed || item.wind_speed),
      maxWindSpeed: parseFloat(item.maxWindSpeed || item.max_wind_speed || item.windSpeed),
      windDirection: parseFloat(item.windDirection || item.wind_direction),
      solarRadiation: parseFloat(item.solarRadiation || item.solar_radiation),
      uvIndex: parseFloat(item.uvIndex || item.uv_index)
    }));
  } catch (error) {
    console.error('获取历史数据失败:', error);
    throw error;
  }
}

// 如果在浏览器环境中，将函数附加到全局对象
if (typeof window !== 'undefined') {
  window.apiConfig = apiConfig;
  window.fetchCurrentSensorData = fetchCurrentSensorData;
  window.fetchHistoricalSensorData = fetchHistoricalSensorData;
}

