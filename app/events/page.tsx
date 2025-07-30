import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { EventCalendar } from "@/components/event-calendar"
import { EventList } from "@/components/event-list"
import { generateSEO, generateStructuredData } from "@/lib/seo"

export const metadata: Metadata = generateSEO({
  title: "Eventos Deportivos en Perú",
  description: "Encuentra los mejores eventos deportivos en Perú. Carreras, maratones y eventos de running. Información detallada sobre fechas, ubicaciones y condiciones climáticas.",
  keywords: ["eventos deportivos", "carreras", "maratones", "running", "Perú", "Lima"],
  url: "https://meteo.app/events",
})

export default function EventsPage() {
  // Generate structured data for upcoming events
  const structuredData = generateStructuredData({
    type: "Event",
    data: {
      title: "Maratón de Lima 2024",
      date: "2024-05-12T08:00:00",
      endDate: "2024-05-12T14:00:00",
      location: "Lima, Perú",
      description: "La maratón más importante de Perú. Recorrido de 42.2 km por las principales avenidas de Lima.",
      organizer: "Municipalidad de Lima",
    },
  })

  return (
    <main className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Calendario de Eventos</CardTitle>
            <CardDescription>Visualiza los eventos por fecha</CardDescription>
          </CardHeader>
          <CardContent>
            <EventCalendar />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Próximos Eventos</CardTitle>
            <CardDescription>Lista de eventos próximos</CardDescription>
          </CardHeader>
          <CardContent>
            <EventList />
          </CardContent>
        </Card>
      </div>
    </main>
  )
} 