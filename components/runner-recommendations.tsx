"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchWeatherData } from "@/lib/api"
import { Clock, Shirt, AlertTriangle, Sun, Check } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface RunnerRecommendationsProps {
  city: string
  country: string
}

export function RunnerRecommendations({ city, country }: RunnerRecommendationsProps) {
  const [bestTime, setBestTime] = useState<string>("")
  const [clothing, setClothing] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getRecommendations = async () => {
      try {
        setLoading(true)
        // WeatherAPI para datos horarios
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=ae8a78cab6254876a5a223607251905&q=${city},${country}&days=1&aqi=no&alerts=no`
        )
        const data = await res.json()
        const hoursArr = data.forecast?.forecastday?.[0]?.hour ?? []
        let uvMax = null
        let uvValue = 0
        try {
          const lat = data.location?.lat
          const lon = data.location?.lon
          if (lat && lon) {
            const uvRes = await fetch(`/api/openuv?lat=${lat}&lon=${lon}`)
            const uvData = await uvRes.json()
            uvValue = typeof uvData.uv === "number" ? uvData.uv : 0
            uvMax = typeof uvData.uv_max === "number" ? uvData.uv_max : null
          }
        } catch {}
        // Función para convertir hora 12h AM/PM a string ISO 24h
        function to24Hour(date: string, time12h: string) {
          const [time, modifier] = time12h.split(" ");
          let [hours, minutes] = time.split(":").map(Number);
          if (modifier === "PM" && hours < 12) hours += 12;
          if (modifier === "AM" && hours === 12) hours = 0;
          return `${date}T${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
        }
        // Calcular horas de sol (robusto y sin errores)
        const sunriseStr = data.forecast?.forecastday?.[0]?.astro?.sunrise
          ? to24Hour(data.forecast.forecastday[0].date, data.forecast.forecastday[0].astro.sunrise)
          : undefined;
        const sunsetStr = data.forecast?.forecastday?.[0]?.astro?.sunset
          ? to24Hour(data.forecast.forecastday[0].date, data.forecast.forecastday[0].astro.sunset)
          : undefined;
        const sunrise = sunriseStr ? new Date(sunriseStr) : undefined;
        const sunset = sunsetStr ? new Date(sunsetStr) : undefined;
        const now = new Date()
        const currentHour = now.getHours()
        const hourly = hoursArr.map((h: any, i: number) => {
          // Convertir hora de WeatherAPI a 24h para comparar correctamente
          let hourNum = 0;
          if (h?.time) {
            const [dateStr, timeStr] = h.time.split(" ");
            // Si timeStr es tipo "12:00 AM" o "03:00 PM"
            if (timeStr && (timeStr.includes("AM") || timeStr.includes("PM"))) {
              const [time, modifier] = timeStr.split(" ");
              let [hours, minutes] = time.split(":").map(Number);
              if (modifier === "PM" && hours < 12) hours += 12;
              if (modifier === "AM" && hours === 12) hours = 0;
              hourNum = hours;
            } else if (timeStr) {
              // Si ya está en 24h
              hourNum = parseInt(timeStr.split(":")[0] ?? "0");
            }
          }
          // UV aprox: si es de día, usa una curva tipo campana centrada al mediodía
          let uvApprox = 0
          if (uvMax && sunrise && sunset && hourNum >= sunrise.getHours() && hourNum <= sunset.getHours()) {
            const noon = Math.round((sunrise.getHours() + sunset.getHours()) / 2)
            const dist = Math.abs(hourNum - noon)
            uvApprox = Math.max(0, uvMax - dist * (uvMax / (sunset.getHours() - sunrise.getHours()) * 1.5))
            uvApprox = Math.round(uvApprox * 100) / 100
          }
          return {
            hour: h?.time?.split(" ")[1] || "-",
            temperature: typeof h?.temp_c === "number" ? h.temp_c : 0,
            uvIndex: i === currentHour ? (typeof uvValue === "number" ? uvValue : 0) : uvApprox,
            precipitation: typeof h?.precip_mm === "number" ? h.precip_mm : 0
          }
        })
        // Mejor hora para correr: UV bajo, temp 15-22°C, sin lluvia, y que sea en el futuro respecto a la hora actual
        const nowDate = new Date();
        const best = hourly.find((h: { hour: string; temperature: number; uvIndex: number; precipitation: number }, idx: number) => {
          // Convertir h.hour a número de hora (24h)
          let hourNum = 0;
          if (h.hour && h.hour.includes(":")) {
            hourNum = parseInt(h.hour.split(":")[0]);
          }
          // Solo considerar horas futuras o la actual
          return (
            h.uvIndex <= 2 &&
            h.precipitation < 0.5 &&
            h.temperature >= 15 &&
            h.temperature <= 22 &&
            hourNum >= nowDate.getHours()
          );
        });
        setBestTime(best ? best.hour : "No hay una hora óptima hoy, revisa el pronóstico.")

        // --- Lógica de vestimenta recomendada ---
        // Usar la hora óptima o la actual si no hay óptima
        const refHour = best || hourly[nowDate.getHours()] || hourly[0];
        const temp = refHour?.temperature ?? 20;
        const uv = refHour?.uvIndex ?? 0;
        const rain = refHour?.precipitation ?? 0;
        const clothes: string[] = [];
        if (temp < 12) {
          clothes.push("Capa térmica", "Camiseta manga larga", "Pantalón largo", "Guantes", "Gorro")
        } else if (temp < 18) {
          clothes.push("Camiseta manga larga", "Pantalón ligero", "Gorra")
        } else if (temp < 24) {
          clothes.push("Camiseta deportiva", "Short o mallas", "Gorra")
        } else {
          clothes.push("Camiseta ligera", "Short", "Gorra", "Lentes de sol")
        }
        if (uv >= 6) {
          clothes.push("Bloqueador solar SPF 50+", "Lentes de sol", "Gorra o visera")
        } else if (uv >= 3) {
          clothes.push("Bloqueador solar SPF 30+")
        }
        if (rain > 0.5) {
          clothes.push("Rompevientos impermeable", "Gorra con visera")
        }
        setClothing(clothes)
        // --- Fin lógica vestimenta ---

        // --- Lógica de advertencias ---
        const warns: string[] = [];
        if (uv >= 8) warns.push("Índice UV muy alto, evita correr al mediodía o usa protección extra.")
        if (rain > 2) warns.push("Lluvia intensa, considera posponer tu entrenamiento.")
        if (temp < 8) warns.push("Temperatura muy baja, abrígate bien y calienta antes de salir.")
        if (temp > 30) warns.push("Temperatura muy alta, hidrátate y evita el sol directo.")
        setWarnings(warns)
        // --- Fin advertencias ---
      } catch (error) {
        setBestTime("No hay una hora óptima hoy, revisa el pronóstico.")
        setClothing([])
        setWarnings([])
      } finally {
        setLoading(false)
      }
    }
    getRecommendations()
  }, [city, country])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Mejor hora para correr</h3>
              <div className="rounded-md bg-muted/50 p-2 text-center">
                <p className="text-lg font-medium">{bestTime}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Shirt className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Vestimenta recomendada</h3>
              <div className="flex flex-wrap gap-2">
                {clothing.map((item, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {warnings.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Advertencias</AlertTitle>
          <AlertDescription>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Alert className="bg-primary/10 border-primary/20">
        <Sun className="h-4 w-4 text-primary" />
        <AlertTitle>Consejo del día</AlertTitle>
        <AlertDescription>
          Recuerde hidratarse adecuadamente antes, durante y después de su carrera. Lleve siempre una botella de agua,
          especialmente en días calurosos.
        </AlertDescription>
      </Alert>
    </div>
  )
}
