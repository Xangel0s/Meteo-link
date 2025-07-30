"use client"

import { useState, useEffect } from "react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { fetchWeatherData } from "@/lib/api"

export function UVHistoryChart() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await fetchWeatherData("Lima", "Peru")
        // Usar el forecast real de WeatherAPI para los últimos días
        const forecastdays = data.forecast?.days || [];
        const uvMax = data.forecast?.max || [];
        const uvAvg = data.forecast?.avg || [];
        const historyData = forecastdays.map((date: string, i: number) => ({
          date: new Date(date).toLocaleDateString("es-ES", { weekday: "short", day: "numeric" }),
          max: uvMax[i] ?? 0,
          avg: uvAvg[i] ?? 0,
        }))
        setData(historyData)
      } catch (error) {
        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    // Actualiza cada semana (604800000 ms = 7 días)
    interval = setInterval(fetchData, 7 * 24 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 12]} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded border border-border bg-background p-2 shadow-md">
                    <p className="font-medium">{label}</p>
                    <p className="text-red-500">Máximo: {payload[0].value}</p>
                    <p className="text-amber-500">Promedio: {payload[1].value}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="max"
            stroke="#ef4444"
            name="UV Máximo"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#f59e0b"
            name="UV Promedio"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
