"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Thermometer, ArrowUp, ArrowDown, Clock } from "lucide-react"
import { fetchWeatherData } from "@/lib/api"

interface TemperatureStatsProps {
  city: string
  country: string
  forecastMode?: boolean
}

export function TemperatureStats({ city, country, forecastMode }: TemperatureStatsProps) {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    current: 0,
    min: 0,
    max: 0,
    feelsLike: 0,
    time: "",
  })
  const [forecast, setForecast] = useState<any[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    const cacheKey = `forecastCache_${city}_${country}`
    const fetchAndStore = async () => {
      setLoading(true)
      try {
        const data = await fetchWeatherData(city, country)
        if (forecastMode) {
          const days = data.forecast?.forecastday || []
          const forecastArr = days.slice(0, 7).map((d: any) => ({
            date: d.date,
            min: d.day?.mintemp_c,
            max: d.day?.maxtemp_c,
            icon: d.day?.condition?.icon,
            text: d.day?.condition?.text,
          }))
          setForecast(forecastArr)
          localStorage.setItem(cacheKey, JSON.stringify({ forecast: forecastArr, timestamp: Date.now() }))
        } else {
          if (!data.forecast?.min || !data.forecast?.max) {
            setStats({ current: 0, min: 0, max: 0, feelsLike: 0, time: "" })
            setLoading(false)
            return
          }
          setStats({
            current: data.temperature,
            min: Math.min(...data.forecast.min),
            max: Math.max(...data.forecast.max),
            feelsLike: data.temperature,
            time: new Date().toLocaleTimeString(),
          })
        }
      } catch (error) {
        setStats({ current: 0, min: 0, max: 0, feelsLike: 0, time: "" })
        setForecast([])
      } finally {
        setLoading(false)
      }
    }
    if (forecastMode) {
      // Intentar cargar de cache
      const cache = localStorage.getItem(cacheKey)
      if (cache) {
        const { forecast, timestamp } = JSON.parse(cache)
        // Si el cache es menor a 12 horas, usarlo
        if (Date.now() - timestamp < 12 * 60 * 60 * 1000) {
          setForecast(forecast)
          setLoading(false)
        } else {
          fetchAndStore()
        }
      } else {
        fetchAndStore()
      }
      // Actualizar automáticamente cada 12 horas
      interval = setInterval(fetchAndStore, 12 * 60 * 60 * 1000)
    } else {
      fetchAndStore()
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [city, country, forecastMode])

  const getTemperatureColor = (temp: number) => {
    if (temp <= 15) return "text-blue-500"
    if (temp <= 20) return "text-emerald-500"
    if (temp <= 25) return "text-amber-500"
    if (temp <= 30) return "text-orange-500"
    return "text-red-500"
  }

  const getProgressColor = (temp: number) => {
    if (temp <= 15) return "bg-blue-500"
    if (temp <= 20) return "bg-emerald-500"
    if (temp <= 25) return "bg-amber-500"
    if (temp <= 30) return "bg-orange-500"
    return "bg-red-500"
  }

  if (loading) {
    return <Skeleton className="h-[120px] w-full" />
  }

  if (forecastMode) {
    // Rellenar hasta 7 días si la API devuelve menos
    const daysToShow = 7;
    let forecastToShow = forecast.slice(0, daysToShow);
    if (forecastToShow.length < daysToShow) {
      const missing = daysToShow - forecastToShow.length;
      for (let i = 0; i < missing; i++) {
        forecastToShow.push({
          date: "-",
          min: "-",
          max: "-",
          icon: "/placeholder.svg",
          text: "Sin datos"
        });
      }
    }
    // Emoji según condición de la API y temperatura, adaptado para no mostrar ❄️ en días soleados fríos
    const getWeatherEmoji = (min: number, max: number, text: string) => {
      const t = text?.toLowerCase() || ""
      if (t.includes("rain")) return "🌧️"
      if (t.includes("thunder")) return "⛈️"
      if (t.includes("snow")) return "❄️"
      if (t.includes("fog") || t.includes("mist")) return "🌫️"
      if (t.includes("cloud")) return "⛅"
      if (t.includes("sun") || t.includes("clear")) {
        if (max >= 30) return "🥵"
        if (max >= 25) return "🌞"
        return "☀️"
      }
      // Fallback por temperatura si el texto no es claro
      if (max >= 30) return "🥵"
      if (max >= 25) return "🌞"
      if (min <= 10) return "🥶"
      return "☀️"
    }
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 pb-2">
              {forecastToShow.map((day, i) => (
                <div key={i} className="flex flex-col items-center bg-background/80 rounded-xl shadow-md px-4 py-3 border border-border hover:scale-105 transition-transform min-w-0 w-full">
                  <span className="text-4xl mb-1">
                    {day.min !== "-" && day.max !== "-" ? getWeatherEmoji(Number(day.min), Number(day.max), day.text) : "❓"}
                  </span>
                  <span className="text-xs text-muted-foreground mb-1 font-semibold">
                    {day.date !== "-" ? new Date(day.date).toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" }) : "-"}
                  </span>
                  <span className="text-sm text-muted-foreground mb-1">{day.text}</span>
                  <div className="flex flex-row gap-2 items-end">
                    <span className="text-2xl font-bold text-blue-500">{day.min}°</span>
                    <span className="text-lg font-bold text-red-500">{day.max}°</span>
                  </div>
                  {/* UV real si está disponible */}
                  {day.uv !== undefined && (
                    <span className="mt-1 text-xs font-semibold rounded px-2 py-1 bg-yellow-100 text-yellow-800">UV: {day.uv}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground text-center mt-2">
              Pronóstico real de temperatura para los próximos 7 días en <span className="font-semibold">{city}</span>.
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Temperatura actual */}
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Thermometer className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Temperatura actual</p>
              <p className={`text-3xl font-bold ${getTemperatureColor(stats.current)}`}>{stats.current}°C</p>
            </div>
          </div>

          {/* Sensación térmica */}
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-orange-100 p-3">
              <Thermometer className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sensación térmica</p>
              <p className={`text-3xl font-bold ${getTemperatureColor(stats.feelsLike)}`}>{stats.feelsLike}°C</p>
            </div>
          </div>

          {/* Mínima/Máxima */}
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <ArrowDown className="h-4 w-4 text-blue-500" />
                <p className="text-sm text-muted-foreground">Mínima</p>
              </div>
              <p className="text-xl font-bold text-blue-500">{stats.min}°C</p>
            </div>
            <div className="h-10 w-px bg-border mx-2"></div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <ArrowUp className="h-4 w-4 text-red-500" />
                <p className="text-sm text-muted-foreground">Máxima</p>
              </div>
              <p className="text-xl font-bold text-red-500">{stats.max}°C</p>
            </div>
          </div>

          {/* Rango de temperatura */}
          <div className="flex flex-col justify-center">
            <div className="flex justify-between mb-1 text-xs">
              <span className="text-blue-500">{stats.min}°C</span>
              <span className="text-red-500">{stats.max}°C</span>
            </div>
            <Progress
              value={((stats.current - stats.min) / (stats.max - stats.min)) * 100}
              className="h-2"
              indicatorClassName={getProgressColor(stats.current)}
            />
            <div className="flex items-center justify-end mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>Actualizado: {stats.time}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
