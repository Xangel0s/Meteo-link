"use client"

import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RoutesMap } from "@/components/routes-map"
import { RoutesList } from "@/components/routes-list"
import { RoutesFilter } from "@/components/routes-filter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Map, List, Filter } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CitySelector } from "@/components/city-selector"
import { useState } from "react"
import { generateSEO, generateStructuredData } from "@/lib/seo"

export const metadata: Metadata = generateSEO({
  title: "Rutas para Correr en Perú",
  description: "Descubre las mejores rutas para correr en Perú. Información detallada sobre distancia, elevación, dificultad y condiciones climáticas. Planifica tu próxima carrera con datos precisos.",
  keywords: ["rutas para correr", "running", "carrera", "Perú", "Lima", "rutas deportivas"],
  url: "https://meteo.app/routes",
})

export default function RoutesPage() {
  const [selectedCity, setSelectedCity] = useState({ value: "lima", label: "Lima", country: "Peru" })

  // Generate structured data for popular routes
  const structuredData = generateStructuredData({
    type: "Route",
    data: {
      name: "Costa Verde",
      description: "Ruta escénica a lo largo del litoral de Lima con vistas al océano Pacífico. Ideal para correr temprano en la mañana o al atardecer.",
      distance: 5.2,
      elevation: 120,
      difficulty: "Intermedio",
      estimatedTime: "30-40 min",
      startPoint: "Miraflores",
      endPoint: "Barranco",
    },
  })

  return (
    <main className="container mx-auto px-4 py-8">
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
            <h1 className="text-3xl font-bold leading-tight tracking-tighter">Mapa de Rutas</h1>
          </div>
          <p className="text-muted-foreground">Explora rutas para correr en tu ciudad</p>
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

      {/* Routes Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filtrar rutas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RoutesFilter />
        </CardContent>
      </Card>

      {/* Tabs for different route views */}
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            <span>Mapa</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>Lista</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Map className="h-5 w-5 text-primary" />
                Mapa de rutas
              </CardTitle>
              <CardDescription>Visualiza todas las rutas disponibles</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px]">
                <RoutesMap />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <List className="h-5 w-5 text-primary" />
                Lista de rutas
              </CardTitle>
              <CardDescription>Todas las rutas disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              <RoutesList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
