"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPin, Users, ExternalLink } from "lucide-react"
import { EventDetailsDialog } from "@/components/event-details-dialog"

export function EventCalendar() {
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<any[]>([])
  const [selectedDayEvents, setSelectedDayEvents] = useState<any[]>([])

  // Fechas con eventos (para mostrar en el calendario)
  const [eventDates, setEventDates] = useState<Date[]>([])

  useEffect(() => {
    // Simular carga de datos
    const fetchEvents = async () => {
      setLoading(true)
      try {
        // Llamada real a la API de Eventbrite para eventos de running en Perú
        const res = await fetch(
          "https://www.eventbriteapi.com/v3/events/search/?q=running&location.address=Peru&sort_by=date&expand=venue,organizer&page_size=50",
          {
            headers: {
              Authorization: "Bearer 7OYRJPYYT4RI7XD3NTGH",
            },
          },
        )
        const data = await res.json()
        const realEvents = (data.events || []).map((event: any) => {
          return {
            id: event.id,
            title: event.name?.text || "Evento sin título",
            date: event.start?.local ? new Date(event.start.local) : new Date(),
            time: event.start?.local
              ? new Date(event.start.local).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "",
            location: event.venue?.address?.localized_address_display || "Perú",
            type: event.category?.name || "Evento",
            distance: "-",
            participants: event.capacity || 0,
            description: event.description?.text || "Sin descripción",
            organizer: event.organizer?.name || "-",
            price: event.is_free ? "Gratis" : "Pago",
            registrationDeadline: event.end?.local ? new Date(event.end.local).toLocaleDateString() : "-",
            url: event.url,
          }
        })
        setEvents(realEvents)

        // Extraer las fechas para mostrar en el calendario
        const dates = realEvents.map((event: any) => event.date)
        setEventDates(dates)

        // Si hay una fecha seleccionada, mostrar los eventos de ese día
        if (date) {
          updateSelectedDayEvents(date, realEvents)
        }
      } catch (error) {
        setEvents([])
        setEventDates([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Actualizar eventos cuando cambia la fecha seleccionada
  useEffect(() => {
    if (date) {
      updateSelectedDayEvents(date, events)
    }
  }, [date, events])

  // Actualizar la fecha al día actual cuando se dispara el evento 'calendar-today'
  useEffect(() => {
    const handler = () => setDate(new Date())
    window.addEventListener('calendar-today', handler)
    return () => window.removeEventListener('calendar-today', handler)
  }, [])

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail instanceof Date) setDate(e.detail)
    }
    window.addEventListener('calendar-set-date', handler as EventListener)
    return () => window.removeEventListener('calendar-set-date', handler as EventListener)
  }, [])

  const updateSelectedDayEvents = (selectedDate: Date, allEvents: any[]) => {
    const dayEvents = allEvents.filter(
      (event) =>
        event.date.getDate() === selectedDate.getDate() &&
        event.date.getMonth() === selectedDate.getMonth() &&
        event.date.getFullYear() === selectedDate.getFullYear(),
    )
    setSelectedDayEvents(dayEvents)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[350px] w-full" />
        <Skeleton className="h-[350px] w-full" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiers={{
            event: eventDates,
          }}
          modifiersStyles={{
            event: {
              fontWeight: "bold",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderRadius: "0",
              color: "var(--primary)",
            },
          }}
        />
      </div>

      <div>
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Eventos para {date?.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
        </h3>

        {selectedDayEvents.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No hay eventos programados para este día.</p>
              <Button variant="outline" className="mt-4">
                Buscar eventos cercanos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {selectedDayEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{event.title}</h4>
                    <Badge>{event.type}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{event.time} hrs</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.participants} participantes</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <Badge variant="outline">{event.distance}</Badge>
                    <EventDetailsDialog
                      event={event}
                      trigger={
                        <Button size="sm" variant="outline" className="gap-1">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Detalles
                        </Button>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
