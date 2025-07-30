"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, CloudLightning, Droplets, Wind, Thermometer } from "lucide-react"

interface WeatherAlert {
  id: string
  type: "storm" | "rain" | "wind" | "heat" | "other"
  severity: "warning" | "watch" | "advisory"
  title: string
  description: string
  startTime: string
  endTime: string
}

interface WeatherAlertsProps {
  city: string
  country: string
}

export function WeatherAlerts({ city, country }: WeatherAlertsProps) {
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true)
      try {
        // Llamada real a WeatherAPI para alertas meteorológicas
        const apiKey = "f857d3f8277e4275bfa11851252105";
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)},${encodeURIComponent(country)}&days=1&alerts=yes`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("WeatherAPI error");
        const data = await res.json();
        const apiAlerts = data.alerts?.alert ?? [];
        // Mapear a formato local
        const mappedAlerts: WeatherAlert[] = apiAlerts.map((a: any, idx: number) => ({
          id: a.id || `alert-${idx}`,
          type: a.event?.toLowerCase().includes("lluv") ? "rain" : a.event?.toLowerCase().includes("viento") ? "wind" : a.event?.toLowerCase().includes("calor") ? "heat" : "other",
          severity: a.severity?.toLowerCase() === "warning" ? "warning" : a.severity?.toLowerCase() === "watch" ? "watch" : "advisory",
          title: a.event || "Alerta meteorológica",
          description: a.desc || a.headline || "",
          startTime: a.effective?.split("T")[1]?.slice(0,5) || "-",
          endTime: a.expires?.split("T")[1]?.slice(0,5) || "-",
        }));
        setAlerts(mappedAlerts);
      } catch (error) {
        console.error("Error fetching weather alerts:", error)
        setAlerts([])
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()
  }, [city, country])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "storm":
        return <CloudLightning className="h-5 w-5" />
      case "rain":
        return <Droplets className="h-5 w-5" />
      case "wind":
        return <Wind className="h-5 w-5" />
      case "heat":
        return <Thermometer className="h-5 w-5" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "warning":
        return "bg-red-100 text-red-800 border-red-200"
      case "watch":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "advisory":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "warning":
        return <Badge variant="destructive">Advertencia</Badge>
      case "watch":
        return <Badge className="bg-amber-500">Vigilancia</Badge>
      case "advisory":
        return (
          <Badge variant="outline" className="text-blue-500 border-blue-500">
            Aviso
          </Badge>
        )
      default:
        return <Badge variant="outline">Información</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No hay alertas meteorológicas activas para {city}.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Alert key={alert.id} className={`${getAlertColor(alert.severity)} border-2`}>
          <div className="flex items-center gap-2">
            {getAlertIcon(alert.type)}
            <AlertTitle className="flex items-center gap-2">
              {alert.title}
              <span className="ml-2">{getSeverityBadge(alert.severity)}</span>
            </AlertTitle>
          </div>
          <AlertDescription className="mt-2">
            <p>{alert.description}</p>
            <p className="mt-2 text-sm font-medium">
              Vigencia: {alert.startTime} - {alert.endTime}
            </p>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
