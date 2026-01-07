const mockState = {
  lastData: null
};

const mockRanges = {
  temperature: { min: -5, max: 38, step: 0.6 },
  humidity: { min: 25, max: 90, step: 2.5 },
  rainfall: { min: 0, max: 12, step: 2 },
  windSpeed: { min: 0.2, max: 8, step: 0.5 },
  maxWindSpeed: { min: 0.5, max: 12, step: 1 },
  windDirection: { min: 0, max: 360, step: 12 },
  solarRadiation: { min: 0, max: 65000, step: 3500 },
  uvIndex: { min: 0, max: 15000, step: 1200 }
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function wrapAngle(value) {
  let angle = value % 360;
  if (angle < 0) angle += 360;
  return angle;
}

function getDaylightFactor(date = new Date()) {
  const hour = date.getHours() + date.getMinutes() / 60;
  const daylight = Math.sin(((hour - 6) / 12) * Math.PI);
  return Math.max(0, daylight);
}

function smoothNextValue(current, range) {
  const delta = (Math.random() - 0.5) * range.step * 2;
  return clamp(current + delta, range.min, range.max);
}

function generateSeedData(date = new Date()) {
  const daylight = getDaylightFactor(date);
  const temperature = 16 + 8 * daylight + (Math.random() - 0.5) * 2.5;
  const humidity = 55 + (1 - daylight) * 20 + (Math.random() - 0.5) * 6;
  const rainfall = Math.random() < 0.12 ? Math.random() * 6 : 0;
  const windSpeed = 1.2 + Math.random() * 1.5;
  const maxWindSpeed = windSpeed + Math.random() * 2;
  const windDirection = Math.random() * 360;
  const solarRadiation = daylight * 50000 + Math.random() * 5000;
  const uvIndex = daylight * 9000 + Math.random() * 1200;

  return {
    timestamp: date.toISOString(),
    temperature: clamp(temperature, mockRanges.temperature.min, mockRanges.temperature.max),
    humidity: clamp(humidity, mockRanges.humidity.min, mockRanges.humidity.max),
    rainfall: clamp(rainfall, mockRanges.rainfall.min, mockRanges.rainfall.max),
    windSpeed: clamp(windSpeed, mockRanges.windSpeed.min, mockRanges.windSpeed.max),
    maxWindSpeed: clamp(maxWindSpeed, mockRanges.maxWindSpeed.min, mockRanges.maxWindSpeed.max),
    windDirection: wrapAngle(windDirection),
    solarRadiation: clamp(solarRadiation, mockRanges.solarRadiation.min, mockRanges.solarRadiation.max),
    uvIndex: clamp(uvIndex, mockRanges.uvIndex.min, mockRanges.uvIndex.max)
  };
}

function generateMockSensorData() {
  const now = new Date();
  const daylight = getDaylightFactor(now);

  if (!mockState.lastData) {
    mockState.lastData = generateSeedData(now);
    return { ...mockState.lastData };
  }

  const baseTemp = 16 + 8 * daylight;
  const baseSolar = daylight * 52000;
  const baseUv = daylight * 9500;

  const nextData = {
    timestamp: now.toISOString(),
    temperature: smoothNextValue(mockState.lastData.temperature + (baseTemp - mockState.lastData.temperature) * 0.05, mockRanges.temperature),
    humidity: smoothNextValue(mockState.lastData.humidity + ((1 - daylight) * 60 - mockState.lastData.humidity) * 0.02, mockRanges.humidity),
    rainfall: mockState.lastData.rainfall > 0
      ? smoothNextValue(mockState.lastData.rainfall, mockRanges.rainfall)
      : (Math.random() < 0.08 ? Math.random() * 5 : 0),
    windSpeed: smoothNextValue(mockState.lastData.windSpeed, mockRanges.windSpeed),
    maxWindSpeed: clamp(
      mockState.lastData.maxWindSpeed + (Math.random() - 0.4) * mockRanges.maxWindSpeed.step,
      mockRanges.maxWindSpeed.min,
      mockRanges.maxWindSpeed.max
    ),
    windDirection: wrapAngle(mockState.lastData.windDirection + (Math.random() - 0.5) * mockRanges.windDirection.step),
    solarRadiation: clamp(baseSolar + (Math.random() - 0.5) * mockRanges.solarRadiation.step, mockRanges.solarRadiation.min, mockRanges.solarRadiation.max),
    uvIndex: clamp(baseUv + (Math.random() - 0.5) * mockRanges.uvIndex.step, mockRanges.uvIndex.min, mockRanges.uvIndex.max)
  };

  mockState.lastData = nextData;
  return { ...nextData };
}

function generateHistoricalData(count = 120, intervalMinutes = 5) {
  const data = [];
  const now = new Date();

  for (let i = count - 1; i >= 0; i -= 1) {
    const timestamp = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);
    const seed = generateSeedData(timestamp);
    data.push(seed);
  }

  if (data.length > 0) {
    mockState.lastData = { ...data[data.length - 1] };
  }

  return data;
}

function initializeHistoricalData() {
  return generateHistoricalData(240, 5);
}

if (typeof window !== 'undefined') {
  window.generateMockSensorData = generateMockSensorData;
  window.initializeHistoricalData = initializeHistoricalData;
  window.generateHistoricalData = generateHistoricalData;
}