"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RunnerRecommendations } from "@/components/runner-recommendations"
import { RunnerRoutes } from "@/components/runner-routes"
import { RunnerCalendar } from "@/components/runner-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Activity, Map, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CitySelector } from "@/components/city-selector"
import { useState } from "react"

export default function RunnerPage() {
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
            <h1 className="text-3xl font-bold leading-tight tracking-tighter">Para Runners</h1>
          </div>
          <p className="text-muted-foreground">Recomendaciones y rutas para corredores</p>
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

      {/* Runner Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recomendaciones para hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RunnerRecommendations city={selectedCity.label} country={selectedCity.country} />
        </CardContent>
      </Card>

      {/* Tabs for different runner views */}
      <Tabs defaultValue="routes" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            <span>Rutas</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Calendario</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Estadísticas</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="routes">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Map className="h-5 w-5 text-primary" />
                Rutas recomendadas
              </CardTitle>
              <CardDescription>Basadas en las condiciones actuales</CardDescription>
            </CardHeader>
            <CardContent>
              <RunnerRoutes city="Lima" country="Peru" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Calendario de eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RunnerCalendar city={selectedCity.label} country={selectedCity.country} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Estadísticas de running
              </CardTitle>
              <CardDescription>Resumen de tu actividad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Conecta tu dispositivo o app de running para ver tus estadísticas
                </p>
                <Button>Conectar dispositivo</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
