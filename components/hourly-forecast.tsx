"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Sun, CloudRain, CloudSnow, Cloud } from "lucide-react"
import { fetchWeatherData } from "@/lib/api"

interface HourlyForecastProps {
  city: string
  country: string
}

interface HourlyData {
  hour: string
  temperature: number
  humidity: number
  windSpeed: number
  uvIndex: number
  precipitation: number
  icon: string
  text: string
}

interface WeatherResponse {
  forecast: {
    forecastday: Array<{
      date: string
      hour: Array<{
        time: string
        temp_c: number
        humidity: number
        wind_kph: number
        uv: number
        precip_mm: number
        condition: {
          icon: string
          text: string
        }
      }>
      day: {
        uv: number
        uv_max?: number
      }
    }>
  }
}

export function HourlyForecast({ city, country }: Readonly<HourlyForecastProps>) {
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const [bestHour, setBestHour] = useState<string | null>(null)

  // Memoize fetch function
  const getHourlyData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Check cache first
      const cacheKey = `hourly-forecast-${city}-${country}`
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        // Cache valid for 30 minutes
        if (Date.now() - timestamp < 30 * 60 * 1000) {
          setHourlyData(data)
          setLoading(false)
          return
        }
      }

      const weather = await fetchWeatherData(city, country) as WeatherResponse
      const forecast = weather.forecast
      if (!forecast || !forecast.forecastday || !forecast.forecastday[0]?.hour) {
        throw new Error("No se encontraron datos del pronóstico")
      }
      const hoursArr = forecast.forecastday[0].hour
      const uvMax = forecast.forecastday[0].day.uv_max ?? forecast.forecastday[0].day.uv ?? 0
      const uvDay = forecast.forecastday[0].day.uv ?? 0
      const now = new Date()
      const currentHour = now.getHours()

      // Process hourly data
      const processedData = hoursArr.map((h, i) => {
        const hourNum = parseInt(h.time.split(" ")[1].split(":")[0])
        const uvApprox = calculateUVApprox(hourNum, uvMax)
        return {
          hour: h.time.split(" ")[1],
          temperature: h.temp_c,
          humidity: h.humidity,
          windSpeed: h.wind_kph,
          uvIndex: hourNum === currentHour ? uvDay : (h.uv ?? uvApprox),
          precipitation: h.precip_mm,
          icon: h.condition.icon,
          text: h.condition.text
        }
      })

      setHourlyData(processedData)
      // Update cache
      localStorage.setItem(cacheKey, JSON.stringify({
        data: processedData,
        timestamp: Date.now()
      }))
      // Find best hour for outdoor activities
      const bestHourIndex = findBestHour(processedData)
      setBestHour(processedData[bestHourIndex]?.hour || null)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al cargar el pronóstico")
      setHourlyData([])
    } finally {
      setLoading(false)
    }
  }, [city, country])

  useEffect(() => {
    getHourlyData()
    // Update every 30 minutes
    const interval = setInterval(getHourlyData, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [getHourlyData])

  // Memoize helper functions
  const calculateUVApprox = useCallback((hour: number, maxUV: number) => {
    if (!maxUV) return 0
    const noon = 12
    const dist = Math.abs(hour - noon)
    return Math.max(0, maxUV - dist * (maxUV / 12))
  }, [])

  const findBestHour = useCallback((data: HourlyData[]) => {
    if (!data.length) return 0
    
    return data.reduce((best, current, index) => {
      const currentScore = calculateHourScore(current)
      const bestScore = calculateHourScore(data[best])
      return currentScore > bestScore ? index : best
    }, 0)
  }, [])

  const calculateHourScore = useCallback((hour: HourlyData) => {
    // Score based on temperature (20-25°C is ideal)
    const tempScore = 1 - Math.abs(hour.temperature - 22.5) / 22.5
    
    // Score based on UV (lower is better)
    const uvScore = 1 - (hour.uvIndex / 12)
    
    // Score based on precipitation (lower is better)
    const precipScore = 1 - (hour.precipitation / 100)
    
    // Weighted average
    return (tempScore * 0.4 + uvScore * 0.4 + precipScore * 0.2)
  }, [])

  // Memoize hourly items
  const hourlyItems = useMemo(() => {
    return hourlyData.map((hour, index) => (
      <div
        key={hour.hour}
        className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-colors ${
          selectedHour === index ? "bg-primary/10" : "hover:bg-muted"
        }`}
        onClick={() => setSelectedHour(index)}
      >
        <span className="text-sm font-medium">{hour.hour}</span>
        <img src={hour.icon} alt={hour.text} className="w-8 h-8 my-2" />
        <span className="text-lg font-bold">{hour.temperature}°C</span>
        <span className="text-sm text-muted-foreground">{hour.text}</span>
      </div>
    ))
  }, [hourlyData, selectedHour])

  const getWeatherIcon = (condition: string) => {
    if (!condition) return <Sun className="h-6 w-6 text-amber-500" />
    if (condition.toLowerCase().includes("rain")) return <CloudRain className="h-6 w-6 text-blue-500" />
    if (condition.toLowerCase().includes("snow")) return <CloudSnow className="h-6 w-6 text-blue-200" />
    if (condition.toLowerCase().includes("sun")) return <Sun className="h-6 w-6 text-yellow-400" />
    if (condition.toLowerCase().includes("cloud")) return <Cloud className="h-6 w-6 text-sky-400" />
    return <Sun className="h-6 w-6 text-amber-500" />
  }

  const getUVColor = (uvIndex: number) => {
    if (uvIndex < 3) return "text-green-500"
    if (uvIndex < 6) return "text-yellow-500"
    if (uvIndex < 8) return "text-orange-500"
    return "text-red-500"
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error || !hourlyData.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex h-[200px] w-full items-center justify-center text-red-500">
            {error || "No se encontraron datos del pronóstico"}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">
            Pronóstico horario para {city}, {country}
          </h2>
          
          {bestHour && (
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm">
                Mejor hora para actividades al aire libre: <strong>{bestHour}</strong>
              </p>
            </div>
          )}

          <ScrollArea className="h-[200px]">
            <div className="flex gap-4">
              {hourlyItems}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
