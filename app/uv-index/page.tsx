import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UVIndexCard } from "@/components/uv-index-card"
import { UVHistoryChart } from "@/components/uv-history-chart"
import { UVForecastTable } from "@/components/uv-forecast-table"
import { UVProtectionGuide } from "@/components/uv-protection-guide"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Info, Calendar, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function UVIndexPage() {
  return (
    <main className="flex min-h-screen flex-col space-y-6 pb-8">
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
            <h1 className="text-3xl font-bold leading-tight tracking-tighter">Índice UV</h1>
          </div>
          <p className="text-muted-foreground">Monitoreo y pronóstico del índice de radiación ultravioleta</p>
        </div>
      </div>

      {/* Current UV Index */}
      <UVIndexCard city="Lima" country="Peru" />

      {/* Tabs for different UV views */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Historial</span>
          </TabsTrigger>
          <TabsTrigger value="forecast" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Pronóstico</span>
          </TabsTrigger>
          <TabsTrigger value="protection" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Protección</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Historial de Índice UV</CardTitle>
              <CardDescription>Datos de los últimos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
              <UVHistoryChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Pronóstico de Índice UV</CardTitle>
              <CardDescription>Próximos 5 días</CardDescription>
            </CardHeader>
            <CardContent>
              <UVForecastTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protection">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Guía de Protección UV</CardTitle>
              <CardDescription>Recomendaciones según el nivel de radiación</CardDescription>
            </CardHeader>
            <CardContent>
              <UVProtectionGuide />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Information Card */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">¿Qué es el Índice UV?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            El <b>Índice UV</b> es una medida internacional de la intensidad de la radiación ultravioleta proveniente del sol que llega a la superficie terrestre. Se utiliza para ayudar a las personas a protegerse de los efectos nocivos del sol, como quemaduras, envejecimiento prematuro de la piel y riesgo de cáncer de piel.
          </p>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs">
            <div className="bg-emerald-100 text-emerald-800 p-2 rounded-md">
              <div className="font-bold">0-2</div>
              <div>Bajo</div>
            </div>
            <div className="bg-amber-100 text-amber-800 p-2 rounded-md">
              <div className="font-bold">3-5</div>
              <div>Moderado</div>
            </div>
            <div className="bg-orange-100 text-orange-800 p-2 rounded-md">
              <div className="font-bold">6-7</div>
              <div>Alto</div>
            </div>
            <div className="bg-red-100 text-red-800 p-2 rounded-md">
              <div className="font-bold">8-10</div>
              <div>Muy Alto</div>
            </div>
            <div className="bg-purple-100 text-purple-800 p-2 rounded-md">
              <div className="font-bold">11+</div>
              <div>Extremo</div>
            </div>
          </div>
          <ul className="mt-4 text-xs text-muted-foreground list-disc list-inside">
            <li>Un valor más alto indica mayor riesgo de daño para la piel y los ojos.</li>
            <li>Se recomienda protección solar a partir de un índice UV de 3.</li>
            <li>El índice UV varía según la hora del día, la altitud, la nubosidad y la ubicación geográfica.</li>
          </ul>
        </CardContent>
      </Card>
    </main>
  )
}
