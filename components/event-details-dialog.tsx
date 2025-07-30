"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon, MapPin, Users, Clock, Calendar, Share2, ExternalLink, User } from "lucide-react"

interface EventDetailsProps {
  event: {
    id: string
    title: string
    date: Date
    time: string
    location: string
    type: string
    distance: string
    participants: number
    description?: string
    url?: string
    organizer?: string
    price?: string
    registrationDeadline?: string
  }
  trigger?: React.ReactNode
}

export function EventDetailsDialog({ event, trigger }: EventDetailsProps) {
  const { toast } = useToast()
  const [isRegistered, setIsRegistered] = useState(false)

  const handleRegister = () => {
    if (!isRegistered) {
      // Mostrar confirmación antes de registrar
      if (window.confirm(`¿Estás seguro que deseas inscribirte en ${event.title}?`)) {
        setIsRegistered(true)
        toast({
          title: "¡Inscripción exitosa!",
          description: `Te has inscrito en ${event.title}. Recibirás un correo con los detalles.`,
        })
      }
    }
  }

  const handleAddToCalendar = () => {
    // Crear evento para Google Calendar
    const eventTitle = event.title
    const eventDetails = `${event.description || ""}\nDistancia: ${event.distance}\nUbicación: ${event.location}`
    const eventLocation = event.location

    // Crear fecha del evento
    const eventDate = new Date(event.date)
    const [hours, minutes] = event.time.split(":").map(Number)
    eventDate.setHours(hours || 0, minutes || 0, 0, 0)

    // Fecha de fin (2 horas después por defecto)
    const endTime = new Date(eventDate)
    endTime.setHours(endTime.getHours() + 2)

    // Formatear fechas para Google Calendar
    const startDate = eventDate.toISOString().replace(/-|:|\.\d+/g, "")
    const endDate = endTime.toISOString().replace(/-|:|\.\d+/g, "")

    // Crear URL para Google Calendar
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(eventLocation)}&dates=${startDate}/${endDate}`

    // Abrir en nueva pestaña
    window.open(googleCalendarUrl, "_blank")

    toast({
      title: "Evento añadido",
      description: "Se ha abierto Google Calendar para añadir este evento.",
    })
  }

  const handleShare = () => {
    // Crear mensaje para compartir
    const message = `¡Mira este evento de running! 🏃‍♂️\n\n*${event.title}*\n📅 ${event.date.toLocaleDateString()}, ${event.time}\n📍 ${event.location}\n🏅 ${event.distance}\n\n${event.description || ""}\n\nVer más en: https://meteolink.vercel.app/calendar`

    // Crear URL para WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`

    // Abrir en nueva pestaña
    window.open(whatsappUrl, "_blank")

    toast({
      title: "Compartir",
      description: "Se ha abierto WhatsApp para compartir el evento.",
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" className="gap-1">
            <ExternalLink className="h-3.5 w-3.5" />
            Detalles
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Badge>{event.type}</Badge>
            <Badge variant="outline">{event.distance}</Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto pr-2">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Fecha y hora</p>
                  <p className="font-medium">
                    {event.date.toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    • {event.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Ubicación</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>
            </div>

            {event.description && (
              <div>
                <h4 className="text-sm font-medium mb-1">Descripción</h4>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Organizador</p>
                  <p className="font-medium">{event.organizer || "Club de Runners Lima"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Cierre de inscripciones</p>
                  <p className="font-medium">{event.registrationDeadline || "1 día antes del evento"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Participantes</p>
                  <p className="font-medium">{event.participants} inscritos</p>
                </div>
              </div>
              {event.price && (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 flex items-center justify-center text-primary">S/</div>
                  <div>
                    <p className="text-xs text-muted-foreground">Precio</p>
                    <p className="font-medium">{event.price}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-md bg-muted p-3 text-sm">
              <h4 className="font-medium mb-1">Recomendaciones</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Llega 30 minutos antes para recoger tu kit</li>
                <li>Usa ropa cómoda y adecuada para la actividad</li>
                <li>Lleva hidratación personal</li>
                <li>No olvides usar protector solar</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-3 pt-4 border-t mt-4">
          <Button
            variant={isRegistered ? "outline" : "default"}
            size="default"
            className="gap-2"
            onClick={handleRegister}
            disabled={isRegistered}
          >
            <User className="h-4 w-4" />
            <span>{isRegistered ? "Inscrito" : "Inscribirse"}</span>
          </Button>
          <Button variant="outline" size="default" className="gap-2" onClick={handleAddToCalendar}>
            <Calendar className="h-4 w-4" />
            <span>Añadir al calendario</span>
          </Button>
          <Button variant="outline" size="default" className="gap-2 ml-auto" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            <span>Compartir</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
