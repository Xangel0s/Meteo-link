"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function UVIndexCard({ city, country }: { city: string, country: string }) {
  const [uv, setUV] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState<string>("")

  useEffect(() => {
    let interval: NodeJS.Timeout
    const fetchUV = async () => {
      setLoading(true)
      try {
        // WeatherAPI para lat/lon
        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=ae8a78cab6254876a5a223607251905&q=${city},${country}&days=1&aqi=no&alerts=no`)
        const data = await res.json()
        const lat = data.location?.lat
        const lon = data.location?.lon
        setDate(data.location?.localtime?.split(" ")[0] || "")
        let uvValue = null
        if (lat && lon) {
          // OpenUV para UV actual
          const uvRes = await fetch(`/api/openuv?lat=${lat}&lon=${lon}`)
          const uvData = await uvRes.json()
          uvValue = typeof uvData.uv === "number" ? uvData.uv : null
        }
        setUV(uvValue)
      } catch (error) {
        setUV(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUV()
    interval = setInterval(fetchUV, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [city, country])

  if (loading) {
    return <Skeleton className="h-32 w-full" />
  }

  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center justify-center">
        <div className="text-lg font-bold mb-2">Índice UV actual</div>
        <div className="text-5xl font-extrabold mb-2">{uv !== null ? uv.toFixed(2) : "-"}</div>
        <div className="text-sm text-muted-foreground mb-2">{date}</div>
        <div className="text-xs text-muted-foreground">
          {uv === null ? "Sin datos de UV" :
            uv <= 2 ? "Bajo" :
            uv <= 5 ? "Moderado" :
            uv <= 7 ? "Alto" :
            uv <= 10 ? "Muy alto" : "Extremo"}
        </div>
      </CardContent>
    </Card>
  )
}
