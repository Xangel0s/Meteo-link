"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPin, Users, ExternalLink } from "lucide-react"
import { EventDetailsDialog } from "@/components/event-details-dialog"

export function EventList() {
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Llamada real a la API de Eventbrite para eventos de running en Perú
        const res = await fetch(
          "https://www.eventbriteapi.com/v3/events/search/?q=running&location.address=Peru&sort_by=date&expand=venue,organizer&page_size=10",
          {
            headers: {
              Authorization: "Bearer 7OYRJPYYT4RI7XD3NTGH",
            },
          }
        );
        const data = await res.json();
        // Mapear los datos de Eventbrite al formato esperado
        const mappedEvents = (data.events || []).map((event: any) => {
          return {
            id: event.id,
            title: event.name?.text || "Evento sin título",
            date: event.start?.local ? new Date(event.start.local) : new Date(),
            time: event.start?.local ? new Date(event.start.local).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
            location: event.venue?.address?.localized_address_display || "Perú",
            type: event.category?.name || "Evento",
            distance: "-",
            participants: event.capacity || 0,
            description: event.description?.text || "Sin descripción",
            organizer: event.organizer?.name || "-",
            price: event.is_free ? "Gratis" : "Pago",
            registrationDeadline: event.end?.local ? new Date(event.end.local).toLocaleDateString() : "-",
            url: event.url,
          };
        });
        setEvents(mappedEvents);
      } catch (error) {
        setEvents([]);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No hay eventos programados.</p>
          <Button variant="outline" className="mt-4">
            Buscar eventos
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{event.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          {event.date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })} •{" "}
                          {event.time} hrs
                        </span>
                      </div>
                    </div>
                    <Badge className="self-start md:self-center">{event.type}</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{event.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{event.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{event.participants} participantes</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">{event.distance}</Badge>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <EventDetailsDialog
                      event={event}
                      trigger={
                        <Button size="sm" className="gap-1">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Ver detalles
                        </Button>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button variant="outline">Cargar más eventos</Button>
          </div>
        </>
      )}
    </div>
  )
}
