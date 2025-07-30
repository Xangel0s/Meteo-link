import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe } from "@/components/globe"
import { UVIndexCard } from "@/components/uv-index-card"
import { WeatherDashboard } from "@/components/weather-dashboard"
import { HourlyForecast } from "@/components/hourly-forecast"
import { RunnerRecommendations } from "@/components/runner-recommendations"
import { SearchBar } from "@/components/search-bar"
import { MapPin, Sun, Wind, Activity, Clock, ChevronDown } from "lucide-react"
import { LimaUvMap } from "@/components/lima-uv-map"
import { UVForecastTable } from "@/components/uv-forecast-table"
import { EventCalendar } from "@/components/event-calendar"
import { RoutesPopularClient } from "@/components/routes-popular-client"
import { generateSEO, generateStructuredData } from "@/lib/seo"

export const metadata: Metadata = generateSEO({
  title: "Meteo - Pronóstico del Tiempo y Eventos Deportivos en Perú",
  description: "La mejor aplicación de pronóstico del tiempo para deportistas en Perú. Información detallada sobre el clima, eventos deportivos y rutas de running.",
  keywords: ["pronóstico del tiempo", "clima", "deportes", "running", "eventos deportivos", "Perú", "Lima"],
  url: "https://meteo.app",
})

export default function Home() {
  // Generate structured data for the main page
  const structuredData = generateStructuredData({
    type: "WebSite",
    data: {
      name: "Meteo",
      description: "Pronóstico del tiempo y eventos deportivos en Perú",
      url: "https://meteo.app",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://meteo.app/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  })

  return (
    <main className="flex min-h-screen flex-col max-w-7xl mx-auto px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Mobile Search (visible only on mobile) */}
      <div className="md:hidden w-full mb-6">
        <SearchBar />
      </div>

      {/* Hero Section with 3D Globe */}
      <section className="relative w-full h-[60vh] mb-8 overflow-hidden rounded-lg border bg-background/80 backdrop-blur-sm">
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Suspense fallback={<div className="flex h-full w-full items-center justify-center">Cargando globo...</div>}>
            <Globe />
          </Suspense>
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-radial from-transparent via-transparent to-background/90 pointer-events-auto">
          <div className="text-center p-8 max-w-xl mx-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Entiende tu clima</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Pronóstico UV especializado para deportistas urbanos en Lima
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/peru/lima">
                  <MapPin className="h-5 w-5" />
                  Ver pronóstico para Lima
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="lg" className="gap-2">
                    Explorar otras ciudades
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Ciudades principales</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/peru/arequipa">Arequipa</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/peru/trujillo">Trujillo</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/peru/cusco">Cusco</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/peru/chiclayo">Chiclayo</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/peru/piura">Piura</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Distritos de Lima</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/peru/lima/miraflores">Miraflores</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/peru/lima/san-isidro">San Isidro</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/peru/lima/barranco">Barranco</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/peru/lima/san-borja">San Borja</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/peru/lima/la-molina">La Molina</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </section>

      {/* Current UV Index Highlight */}
      <section className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Sun className="h-6 w-6 text-amber-500" />
            Índice UV actual en Lima
          </h2>
          <UVIndexCard city="Lima" country="Peru" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Para runners
          </h2>
          <RunnerRecommendations city="Lima" country="Peru" />
        </div>
      </section>

      {/* Hourly Forecast */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          Pronóstico por hora
        </h2>
        <HourlyForecast city="Lima" country="Peru" />
      </section>

      {/* Weather Dashboard */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Wind className="h-6 w-6 text-primary" />
          Pronóstico detallado
        </h2>
        <WeatherDashboard city="Lima" country="Peru" />
      </section>

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-6">Características</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <Sun className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Pronóstico UV preciso</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Datos actualizados cada hora para planificar tus actividades al aire libre con seguridad.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Recomendaciones personalizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Consejos específicos para runners, ciclistas y deportistas urbanos.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Microclimas por distrito</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Información detallada por zonas de Lima para una experiencia más precisa.
              </p>
            </CardContent>
          </Card>
        </div>
        {/* Mapa de microclimas de Lima */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Mapa de microclimas: Lima Metropolitana
          </h3>
          <LimaUvMap />
        </div>
      </section>

      {/* Newsletter */}
      <section className="mb-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Mantente informado</CardTitle>
            <CardDescription>
              Recibe actualizaciones sobre el clima y consejos para tus actividades al aire libre.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input type="email" placeholder="Tu correo electrónico" className="flex-1 px-4 py-2 rounded-md border" />
              <Button>Suscribirse</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t text-center text-sm text-muted-foreground">
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
    </main>
  )
}
