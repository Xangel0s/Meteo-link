// This is a mock API service for the weather application
// In a real application, you would connect to actual weather APIs

// TODO: Reemplazar este mock por una integración real con una API de clima, por ejemplo OpenWeatherMap, WeatherAPI, etc.
// El resto del proyecto debe ser actualizado para consumir datos reales.

// Reemplazo: ahora usa datos reales de WeatherAPI
const WEATHERAPI_KEY = "f857d3f8277e4275bfa11851252105";
const WEATHERAPI_BASE_URL = "https://api.weatherapi.com/v1/forecast.json";

// OpenUV para índice UV
const OPENUV_API_KEY = "openuv-kus0rmavj7d6z-io"

// Simple in-memory cache
const weatherCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 35 * 60 * 1000; // 35 minutos en ms

export async function getUVIndex(lat: number, lon: number) {
  const res = await fetch(
    `https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`,
    {
      headers: { 'x-access-token': OPENUV_API_KEY },
    }
  )
  if (!res.ok) throw new Error('No se pudo obtener el índice UV de OpenUV')
  const data = await res.json()
  return {
    uv: data.result.uv,
    uv_max: data.result.uv_max,
    uv_time: data.result.uv_time,
    uv_max_time: data.result.uv_max_time,
  }
}

// AQI y clima principal desde WAQI
export async function fetchAQIAndWeatherWAQI(city: string) {
  const waqiRes = await fetch(`https://api.waqi.info/feed/${city}/?token=4f1b553e55fdcf6a01cc7b23c99da238fe9b2c21`);
  const waqi = await waqiRes.json();
  if (waqi.status !== "ok") throw new Error("WAQI error");
  return {
    aqi: waqi.data.aqi ?? null,
    temp: waqi.data.iaqi?.t?.v ?? null,
    humidity: waqi.data.iaqi?.h?.v ?? null,
    wind: waqi.data.iaqi?.w?.v ?? null,
    city: waqi.data.city?.name ?? city,
    lat: waqi.data.city?.geo?.[0] ?? null,
    lon: waqi.data.city?.geo?.[1] ?? null,
    time: waqi.data.time?.s ?? null,
  };
}

// Mock function to fetch weather data
export async function fetchWeatherData(city: string, country: string) {
  let waqiData = null;
  try {
    waqiData = await fetchAQIAndWeatherWAQI(city);
  } catch {}
  // WeatherAPI solo para UV y forecast
  const cacheKey = `${city.toLowerCase()},${country.toLowerCase()}`;
  const now = Date.now();
  if (weatherCache[cacheKey] && now - weatherCache[cacheKey].timestamp < CACHE_DURATION) {
    return { ...weatherCache[cacheKey].data, ...waqiData };
  }
  const url = `${WEATHERAPI_BASE_URL}?key=${WEATHERAPI_KEY}&q=${encodeURIComponent(city)},${encodeURIComponent(country)}&days=7&aqi=no&alerts=no`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("WeatherAPI error");
  const data = await res.json();
  const forecastdays = data.forecast?.forecastday ?? [];
  const todayHours = forecastdays[0]?.hour ?? [];
  const forecast = {
    days: forecastdays.map((d: any) => d.date),
    min: forecastdays.map((d: any) => d.day?.mintemp_c),
    max: forecastdays.map((d: any) => d.day?.maxtemp_c),
    avg: forecastdays.map((d: any) => d.day?.avgtemp_c),
    icon: forecastdays.map((d: any) => d.day?.condition?.icon),
    text: forecastdays.map((d: any) => d.day?.condition?.text),
    temperature: todayHours.map((h: any) => h.temp_c),
    humidity: todayHours.map((h: any) => h.humidity),
    windSpeed: todayHours.map((h: any) => h.wind_kph),
    uvIndex: todayHours.map((h: any) => h.uv),
    precipitation: todayHours.map((h: any) => h.precip_mm),
    hours: todayHours.map((h: any) => h.time ? h.time.split(" ")[1] : ""),
    forecastday: forecastdays // <-- Agrega el array forecastday completo
  };
  const result = {
    city: waqiData?.city ?? data.location?.name,
    country: data.location?.country,
    temperature: waqiData?.temp ?? data.current?.temp_c,
    humidity: waqiData?.humidity ?? data.current?.humidity,
    windSpeed: waqiData?.wind ?? data.current?.wind_kph,
    uvIndex: data.current?.uv,
    aqi: waqiData?.aqi ?? null,
    lat: waqiData?.lat ?? data.location?.lat,
    lon: waqiData?.lon ?? data.location?.lon,
    forecast: forecast,
    current: data.current
  };
  weatherCache[cacheKey] = { data: result, timestamp: now };
  return result;
}

// Mock function to fetch microclimate data for districts
export async function fetchMicroclimateData(city: string, country: string) {
  // OpenWeatherMap no da microclimas por distrito, pero puedes usar la API de clima para varias ciudades/distritos
  // Aquí solo retorna el clima del city principal
  const mainWeather = await fetchWeatherData(city, country)
  return [
    {
      district: city,
      temperature: mainWeather.temperature,
      uvIndex: mainWeather.uvIndex,
      coordinates: [mainWeather.lat || 0, mainWeather.lon || 0]
    }
  ];
}
