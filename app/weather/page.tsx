"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WeatherDashboard } from "@/components/weather-dashboard"
import { HourlyForecast } from "@/components/hourly-forecast"
import { WeatherAlerts } from "@/components/weather-alerts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Cloud, Bell } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CitySelector } from "@/components/city-selector"
import { useState } from "react"
import { Metadata } from "next"
import { generateSEO, generateStructuredData } from "@/lib/seo"

export const metadata: Metadata = generateSEO({
  title: "Pronóstico del Tiempo en Perú",
  description: "Pronóstico del tiempo actualizado para todo Perú. Información detallada sobre temperatura, humedad, viento y condiciones climáticas para las próximas horas y días.",
  keywords: ["pronóstico del tiempo", "clima", "temperatura", "humedad", "viento", "Perú", "Lima"],
  url: "https://meteo.app/weather",
})

export default function WeatherPage() {
  const [selectedCity, setSelectedCity] = useState({ value: "lima", label: "Lima", country: "Peru" })

  // Generate structured data for current weather
  const structuredData = generateStructuredData({
    type: "WeatherForecast",
    data: {
      location: "Lima, Perú",
      temperature: "22°C",
      conditions: "Parcialmente nublado",
      humidity: "75%",
      windSpeed: "15 km/h",
      forecast: [
        {
          date: "2024-03-20",
          highTemp: "24°C",
          lowTemp: "18°C",
          conditions: "Soleado",
        },
        {
          date: "2024-03-21",
          highTemp: "23°C",
          lowTemp: "17°C",
          conditions: "Parcialmente nublado",
        },
      ],
    },
  })

  return (
    <main className="flex min-h-screen flex-col space-y-6 pb-8 max-w-7xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="sm" asChild className="mr-1 p-0 h-8 w-8">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Volver</span>
              </Link>
            </Button>
            <h1 className="text-3xl font-bold leading-tight tracking-tighter">Clima</h1>
          </div>
          <p className="text-muted-foreground">Pronóstico detallado del clima</p>
        </div>
        <CitySelector value={selectedCity.value} setValue={(val) => {
          const cities = [
            { value: "lima", label: "Lima", country: "Peru" },
            { value: "arequipa", label: "Arequipa", country: "Peru" },
            { value: "trujillo", label: "Trujillo", country: "Peru" },
            { value: "cusco", label: "Cusco", country: "Peru" },
            { value: "piura", label: "Piura", country: "Peru" },
            { value: "chiclayo", label: "Chiclayo", country: "Peru" },
            { value: "iquitos", label: "Iquitos", country: "Peru" },
            { value: "huancayo", label: "Huancayo", country: "Peru" },
          ];
          const found = cities.find(c => c.value === val) || cities[0];
          setSelectedCity(found);
        }} />
      </div>

      {/* Hourly Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            Pronóstico por hora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HourlyForecast city={selectedCity.label} country={selectedCity.country} />
        </CardContent>
      </Card>

      {/* Tabs for different weather views */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            <span>Pronóstico</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Alertas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Cloud className="h-5 w-5 text-primary" />
                Pronóstico detallado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeatherDashboard city={selectedCity.label} country={selectedCity.country} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Alertas meteorológicas
              </CardTitle>
              <CardDescription>Alertas y advertencias activas</CardDescription>
            </CardHeader>
            <CardContent>
              <WeatherAlerts city={selectedCity.label} country={selectedCity.country} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
