"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TemperatureChart } from "@/components/temperature-chart"
import { TemperatureStats } from "@/components/temperature-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Thermometer, BarChart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CitySelector } from "@/components/city-selector"

export default function TemperaturePage() {
  const [selectedCity, setSelectedCity] = useState({ value: "lima", label: "Lima", country: "Peru" })

  return (
    <main className="flex min-h-screen flex-col space-y-6 pb-8 max-w-7xl mx-auto">
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
            <h1 className="text-3xl font-bold leading-tight tracking-tighter">Temperatura</h1>
          </div>
          <p className="text-muted-foreground">Análisis detallado de temperatura</p>
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

      {/* Current Temperature Stats */}
      <TemperatureStats city={selectedCity.label} country={selectedCity.country} />

      {/* Tabs for different temperature views */}
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="chart" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Gráfico</span>
          </TabsTrigger>
          <TabsTrigger value="forecast" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            <span>Pronóstico</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Gráfico de temperatura
              </CardTitle>
              <CardDescription>Últimas 24 horas</CardDescription>
            </CardHeader>
            <CardContent>
              <TemperatureChart city={selectedCity.label} country={selectedCity.country} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-primary" />
                Pronóstico de temperatura
              </CardTitle>
              <CardDescription>Próximos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aquí puedes mostrar un pronóstico real de temperatura para los próximos 5 días usando el componente adecuado o implementando uno nuevo */}
              <TemperatureStats city={selectedCity.label} country={selectedCity.country} forecastMode />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
