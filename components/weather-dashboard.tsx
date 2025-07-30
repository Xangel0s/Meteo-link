"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "@/components/ui/chart"
import { fetchWeatherData } from "@/lib/api"
import { Thermometer, Droplets, Wind, Sun, Umbrella, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"

// Lazy load components
const TemperatureChart = dynamic(() => import("./temperature-chart").then(mod => mod.TemperatureChart), {
  loading: () => <Skeleton className="h-[300px] w-full" />
})

const UVHistoryChart = dynamic(() => import("./uv-history-chart").then(mod => mod.UVHistoryChart), {
  loading: () => <Skeleton className="h-[300px] w-full" />
})

interface WeatherDashboardProps {
  city: string
  country: string
}

interface WeatherData {
  forecast: {
    hours: string[]
    temperature: number[]
    humidity: number[]
    windSpeed: number[]
    uvIndex: number[]
    precipitation: number[]
  }
}

interface ChartData {
  temperature: Array<{ label: string; value: number }>
  humidity: Array<{ label: string; value: number }>
  windSpeed: Array<{ label: string; value: number }>
  uvIndex: Array<{ label: string; value: number }>
  precipitation: Array<{ label: string; value: number }>
}

export function WeatherDashboard({ city, country }: WeatherDashboardProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoize fetch function
  const getWeatherData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchWeatherData(city, country)
      if (!data.forecast) {
        throw new Error("No se encontraron datos del clima")
      }
      setWeatherData(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al cargar los datos del clima")
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }, [city, country])

  useEffect(() => {
    getWeatherData()
    // Actualizar cada 30 minutos
    const interval = setInterval(getWeatherData, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [getWeatherData])

  // Memoize chart data
  const chartData = useMemo<ChartData>(() => {
    if (!weatherData?.forecast?.hours || !Array.isArray(weatherData.forecast.hours)) {
      return {
        temperature: [],
        humidity: [],
        windSpeed: [],
        uvIndex: [],
        precipitation: []
      }
    }
    
    return {
      temperature: weatherData.forecast.hours.map((hour: string, i: number) => ({
        label: hour,
        value: weatherData.forecast.temperature[i] || 0
      })),
      humidity: weatherData.forecast.hours.map((hour: string, i: number) => ({
        label: hour,
        value: weatherData.forecast.humidity[i] || 0
      })),
      windSpeed: weatherData.forecast.hours.map((hour: string, i: number) => ({
        label: hour,
        value: weatherData.forecast.windSpeed[i] || 0
      })),
      uvIndex: weatherData.forecast.hours.map((hour: string, i: number) => ({
        label: hour,
        value: weatherData.forecast.uvIndex[i] || 0
      })),
      precipitation: weatherData.forecast.hours.map((hour: string, i: number) => ({
        label: hour,
        value: weatherData.forecast.precipitation[i] || 0
      }))
    }
  }, [weatherData])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error || !weatherData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex h-[400px] w-full items-center justify-center text-red-500">
            {error || "Error al cargar los datos del clima"}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      <TemperatureChart city={city} country={country} />
      <UVHistoryChart />
    </div>
  )
}
