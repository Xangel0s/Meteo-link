"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "@/components/ui/chart"
import { getUVIndex, fetchWeatherData } from "@/lib/api"

interface TemperatureChartProps {
  city: string
  country: string
}

export function TemperatureChart({ city, country }: TemperatureChartProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [uvData, setUvData] = useState<any[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout
    const fetchData = async () => {
      setLoading(true)
      try {
        const weather = await fetchWeatherData(city, country)
        const forecast = weather.forecast
        if (!forecast || !forecast.days) {
          setData([])
          setUvData([])
          setLoading(false)
          return
        }
        // Mostrar datos de 5 días
        const chartData = forecast.days.map((date: string, i: number) => ({
          day: date,
          min: forecast.min[i],
          max: forecast.max[i],
          avg: forecast.avg[i],
          icon: forecast.icon[i],
          text: forecast.text[i],
        }))
        setData(chartData)
      } catch (error) {
        setData([])
        setUvData([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    interval = setInterval(fetchData, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [city, country])

  if (loading) {
    return <Skeleton className="h-64 w-full" />
  }
  if (!data.length) {
    return <div className="text-center text-red-500 py-8">No hay datos de temperatura disponibles.</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis domain={[0, 'dataMax + 5']} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="min" stroke="#60a5fa" name="Mínima (°C)" />
        <Line type="monotone" dataKey="max" stroke="#f87171" name="Máxima (°C)" />
        <Line type="monotone" dataKey="avg" stroke="#facc15" name="Promedio (°C)" />
      </LineChart>
    </ResponsiveContainer>
  )
}
