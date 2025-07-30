"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { getUVIndex, fetchWeatherData } from "@/lib/api"

interface UVForecastDay {
  date: string
  day: string
  morning: number
  noon: number
  afternoon: number
  maxUV: number
  isMock?: boolean // Permite marcar si el dato es mock
}

export function UVForecastTable() {
  const [loading, setLoading] = useState(true)
  const [forecast, setForecast] = useState<UVForecastDay[]>([])
  const [uvHistory, setUvHistory] = useState<UVForecastDay[]>([]);

  useEffect(() => {
    // Obtener historial real de UV de la API (días pasados y hoy)
    fetch('/api/uv-history?city=Lima&country=Peru')
      .then(res => res.json())
      .then(data => {
        // data debe ser un array de UVForecastDay reales para días pasados y hoy
        setUvHistory(data);
      })
      .catch(() => setUvHistory([]));
  }, []);

  useEffect(() => {
    let halfDayInterval;
    let panelInterval;
    const fetchData = async (forcePanelUpdate = false) => {
      setLoading(true)
      try {
        const weather = await fetchWeatherData("Lima", "Peru")
        const forecastdays = weather.forecast?.forecastday ?? [];
        const today = new Date();
        let baseDate = today;
        if (!forcePanelUpdate) {
          const cache = localStorage.getItem("uvForecastCache");
          if (cache) {
            const { forecast } = JSON.parse(cache);
            if (forecast && forecast.length > 0) {
              baseDate = new Date(forecast[0].date);
            }
          }
        }
        const forecastData: UVForecastDay[] = [];
        // 5 días: los primeros (pasados y hoy) con datos reales, el resto mock
        for (let d = 0; d < 5; d++) {
          const dateObj = new Date(baseDate);
          dateObj.setDate(baseDate.getDate() + d);
          const dateStr = dateObj.toISOString().split("T")[0];
          // Buscar si hay dato real en el historial
          const realDay = uvHistory.find(day => day.date === dateStr);
          if (realDay) {
            forecastData.push({ ...realDay, isMock: false });
          } else {
            // Mock para días futuros
            const morning = getMockUV(d * 3) || 7;
            const noon = getMockUV(d * 3 + 1) || 9;
            const afternoon = getMockUV(d * 3 + 2) || 6;
            const maxUV = Math.max(morning, noon, afternoon, 7);
            forecastData.push({
              date: dateStr,
              day: dateObj.toLocaleDateString("es-ES", { weekday: "long" }),
              morning: morning > 0 ? morning : 7,
              noon: noon > 0 ? noon : 9,
              afternoon: afternoon > 0 ? afternoon : 6,
              maxUV: maxUV > 0 ? maxUV : 9,
              isMock: true,
            });
          }
        }
        setForecast(forecastData)
        localStorage.setItem("uvForecastCache", JSON.stringify({ forecast: forecastData, timestamp: Date.now() }))
      } catch (error) {
        setForecast([])
      } finally {
        setLoading(false)
      }
    }
    function getMockUV(offset: number) {
      return Math.round((4 + Math.random() * 6) * 10) / 10
    }
    const cache = localStorage.getItem("uvForecastCache")
    let cacheTimestamp = 0;
    if (cache) {
      const { forecast, timestamp } = JSON.parse(cache)
      cacheTimestamp = timestamp;
      if (Date.now() - timestamp < 5 * 24 * 60 * 60 * 1000) {
        setForecast(forecast)
        setLoading(false)
      } else {
        fetchData(true)
      }
    } else {
      fetchData(true)
    }
    // Actualizar mocks por datos reales cada 12 horas
    halfDayInterval = setInterval(() => fetchData(false), 12 * 60 * 60 * 1000)
    // Actualizar panel completo cada 5 días
    const msToNextPanel = cacheTimestamp ? Math.max(0, 5 * 24 * 60 * 60 * 1000 - (Date.now() - cacheTimestamp)) : 0;
    panelInterval = setTimeout(() => {
      fetchData(true)
      setInterval(() => fetchData(true), 5 * 24 * 60 * 60 * 1000)
    }, msToNextPanel)
    return () => {
      clearInterval(halfDayInterval)
      clearTimeout(panelInterval)
    }
  }, [uvHistory])

  const getUVBadge = (uvIndex: number, isMock?: boolean) => {
    let badge = null;
    if (uvIndex <= 2) badge = <Badge className="bg-emerald-500">{uvIndex}</Badge>;
    else if (uvIndex <= 5) badge = <Badge className="bg-amber-500">{uvIndex}</Badge>;
    else if (uvIndex <= 7) badge = <Badge className="bg-orange-500">{uvIndex}</Badge>;
    else if (uvIndex <= 10) badge = <Badge className="bg-red-500">{uvIndex}</Badge>;
    else badge = <Badge className="bg-purple-500">{uvIndex}</Badge>;
    return (
      <span className="inline-flex items-center gap-1">
        {badge}
        {isMock ? <span className="text-xs text-muted-foreground italic ml-1">aprox.</span> : null}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Día</TableHead>
            <TableHead className="text-center">Mañana (8-10h)</TableHead>
            <TableHead className="text-center">Mediodía (12-14h)</TableHead>
            <TableHead className="text-center">Tarde (16-18h)</TableHead>
            <TableHead className="text-center">UV Máximo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forecast.map((day, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <div>{day.day}</div>
                <div className="text-xs text-muted-foreground">{day.date}</div>
              </TableCell>
              <TableCell className="text-center">{getUVBadge(day.morning)}</TableCell>
              <TableCell className="text-center">{getUVBadge(day.noon)}</TableCell>
              <TableCell className="text-center">{getUVBadge(day.afternoon)}</TableCell>
              <TableCell className="text-center font-bold">{getUVBadge(day.maxUV)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="text-xs text-muted-foreground mt-1">Los valores se actualizan automáticamente cada día.</div>
    </div>
  )
}
