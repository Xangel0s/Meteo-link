import { Suspense } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { WeatherDashboard } from "@/components/weather-dashboard"
import { UVIndexCard } from "@/components/uv-index-card"
import { RunnerRecommendations } from "@/components/runner-recommendations"
import { CityMap } from "@/components/city-map"
import { HourlyForecast } from "@/components/hourly-forecast"
import { SearchBar } from "@/components/search-bar"
import { ArrowLeft, MapPin, Wind, Activity } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { LimaUvMap } from "@/components/lima-uv-map"
import { AirQuality } from "@/components/air-quality"
import { RoutesPopularClient } from "@/components/routes-popular-client"
import { ShareModalButton } from "@/components/routes-popular-client"

const ROUTE_COORDS: Record<string, { lat: number; lon: number }> = {
  "costa-verde": { lat: -12.1211, lon: -77.0336 },
  "parque-olivar": { lat: -12.0964, lon: -77.0378 },
  "malecon-miraflores": { lat: -12.1295, lon: -77.0312 },
}

function getUvLevel(uv: number) {
  if (uv <= 2) return { level: "bajo", class: "text-emerald-500" }
  if (uv <= 5) return { level: "moderado", class: "text-amber-500" }
  if (uv <= 7) return { level: "alto", class: "text-orange-500" }
  if (uv <= 10) return { level: "muy alto", class: "text-red-500" }
  return { level: "extremo", class: "text-purple-700" }
}

export async function generateStaticParams() {
  return [{ country: "peru", city: "lima" }]
}

export default function CityPage({ params }: Readonly<{ params: { country: string; city: string } }>) {
  // Next.js 15+ puede requerir que params sea accedido de forma asíncrona en rutas dinámicas
  // pero en la mayoría de casos, si params ya es un objeto, esto es seguro:
  let country = ""
  if (typeof params.country === "string") country = params.country
  else if (Array.isArray(params.country)) country = params.country[0] || ""

  let city = ""
  if (typeof params.city === "string") city = params.city
  else if (Array.isArray(params.city)) city = params.city[0] || ""
  const formattedCity = city.charAt(0).toUpperCase() + city.slice(1)
  const formattedCountry = country.charAt(0).toUpperCase() + country.slice(1)

  const routes = [
    {
      id: "costa-verde",
      name: "Costa Verde",
      distance: 5.2,
      uvLevel: "moderado",
      uvClass: "text-amber-500",
      difficulty: "Intermedio",
      elevation: 120,
      estimatedTime: "30-40 min",
      description:
        "Ruta escénica a lo largo del litoral de Lima con vistas al océano Pacífico. Ideal para correr temprano en la mañana o al atardecer.",
      terrain: "Pavimento y senderos",
      startPoint: "Miraflores",
      endPoint: "Barranco",
      image: "/costa%20verde.jpg",
    },
    {
      id: "parque-olivar",
      name: "Parque El Olivar",
      distance: 3.1,
      uvLevel: "bajo",
      uvClass: "text-emerald-500",
      difficulty: "Fácil",
      elevation: 45,
      estimatedTime: "15-20 min",
      description:
        "Recorrido tranquilo entre olivos centenarios con abundante sombra. Perfecto para principiantes o para días con alto índice UV.",
      terrain: "Tierra compacta y césped",
      startPoint: "Entrada principal",
      endPoint: "Entrada principal",
      image: "/parque.jpg",
    },
    {
      id: "malecon-miraflores",
      name: "Malecón de Miraflores",
      distance: 4.5,
      uvLevel: "alto",
      uvClass: "text-orange-500",
      difficulty: "Intermedio",
      elevation: 85,
      estimatedTime: "25-35 min",
      description:
        "Ruta panorámica con vistas al mar y varios parques. Cuenta con estaciones de ejercicio y fuentes de agua en el camino.",
      terrain: "Pavimento",
      startPoint: "Parque del Amor",
      endPoint: "Larcomar",
      image: "/malecon.jpg",
    },
  ]

  return (
    <main className="flex flex-col space-y-6 pb-8">
      {/* Mobile Search (visible only on mobile) */}
      <div className="md:hidden w-full mb-2">
        <SearchBar />
      </div>

      {/* City Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="sm" asChild className="mr-1 p-0 h-8 w-8">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Volver</span>
              </Link>
            </Button>
            <MapPin className="h-5 w-5 text-primary" />
            <h1 className="text-3xl font-bold leading-tight tracking-tighter">
              {formattedCity}, {formattedCountry}
            </h1>
          </div>
          <p className="text-muted-foreground">Pronóstico especializado para deportistas urbanos</p>
        </div>
        <div className="flex gap-2">
          <ShareModalButton city={formattedCity} country={formattedCountry} />
        </div>
      </div>

      {/* UV Index Card */}
      <UVIndexCard city={formattedCity} country={formattedCountry} />

      {/* Hourly Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Pronóstico por hora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HourlyForecast city={formattedCity} country={formattedCountry} />
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="dashboard">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Wind className="h-4 w-4" />
            <span>Pronóstico</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Mapa</span>
          </TabsTrigger>
          <TabsTrigger value="runner" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Runner</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Wind className="h-5 w-5 text-primary" />
                Pronóstico detallado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeatherDashboard city={formattedCity} country={formattedCountry} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Mapa de microclimas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px]">
                <Suspense
                  fallback={<div className="flex h-full w-full items-center justify-center">Cargando mapa...</div>}
                >
                  {city.toLowerCase() === "lima" ? (
                    <LimaUvMap />
                  ) : (
                    <CityMap city={city} country={country} />
                  )}
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="runner" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recomendaciones para runners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RunnerRecommendations city={formattedCity} country={formattedCountry} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Calidad del aire</CardTitle>
          </CardHeader>
          <CardContent>
            <AirQuality />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rutas populares</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Suspense opcional si es Client Component */}
            <RoutesPopularClient routes={routes} />
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t text-center text-sm text-muted-foreground mt-6">
        <p>© 2025 MeteoLink. Todos los derechos reservados.</p>
        <div className="flex justify-center gap-6 mt-2">
          <Link href="/about" className="hover:text-primary hover:underline">
            Acerca de
          </Link>
          <Link href="/privacy" className="hover:text-primary hover:underline">
            Privacidad
          </Link>
          <Link href="/terms" className="hover:text-primary hover:underline">
            Términos
          </Link>
        </div>
      </footer>

      {/* Toaster para notificaciones */}
      <Toaster />
    </main>
  )
}
