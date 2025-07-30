"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapIcon, Calendar, ShareIcon, Clock, TrendingUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { FaWhatsapp, FaFacebook, FaTwitter, FaTelegram, FaLinkedin } from "react-icons/fa"

export interface Route {
  id: string
  name: string
  distance: number
  uvLevel: string
  uvClass: string
  difficulty: string
  elevation: number
  estimatedTime: string
  description: string
  terrain: string
  startPoint: string
  endPoint: string
  image: string
  coordinates?: [number, number][]
}

interface Event {
  id: string
  title: string
  date: string
  time: string
  description: string
  type: "upcoming" | "recurring" | "featured"
  registrationUrl?: string
}

const routeImages: Record<string, string> = {
  "Costa Verde": "/costa%20verde.jpg",
  "Parque El Olivar": "/parque.jpg",
  "Malecón de Miraflores": "/malecon.jpg"
};

const normalizeRouteName = (name: string) => name.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9 ]/gi, "").trim();
const normalizedRouteImages: Record<string, string> = Object.fromEntries(
  Object.entries(routeImages).map(([k, v]) => [normalizeRouteName(k), v])
);

export function RouteDetailsDialog({ route }: { route: Route }) {
  const { toast } = useToast()
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true)

  // Obtener eventos de la API
  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/events?city=Lima&country=Peru&routeId=${route.id}`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(() => setEvents([]))
      .finally(() => setIsLoading(false));
  }, [route.id]);

  // Función para programar en Google Calendar
  const handleSchedule = () => {
    try {
      // Crear evento para Google Calendar
      const eventTitle = `Correr en ${route.name}`
      const eventDetails = `Ruta: ${route.name}\nDistancia: ${route.distance} km\nDificultad: ${route.difficulty}\nTiempo estimado: ${route.estimatedTime}`
      const eventLocation = `${route.startPoint}, Lima, Perú`

      // Crear fecha para mañana a las 7am
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(7, 0, 0, 0)

      // Fecha de fin (1 hora después)
      const endTime = new Date(tomorrow)
      endTime.setHours(endTime.getHours() + 1)

      // Formatear fechas para Google Calendar
      const startDate = tomorrow.toISOString().replace(/-|:|\.\d+/g, "")
      const endDate = endTime.toISOString().replace(/-|:|\.\d+/g, "")

      // Crear URL para Google Calendar
      const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(eventLocation)}&dates=${startDate}/${endDate}`

      // Abrir en nueva pestaña
      window.open(googleCalendarUrl, "_blank")

      toast({
        title: "Evento programado",
        description: "Se ha abierto Google Calendar para programar tu carrera.",
      })
    } catch (error) {
      console.error("Error scheduling event:", error)
      toast({
        title: "Error",
        description: "No se pudo programar el evento. Intenta de nuevo más tarde.",
        variant: "destructive",
      })
    }
  }

  // Generar coordenadas de ruta si no existen
  const getRouteCoordinates = () => {
    if (route.coordinates) return route.coordinates

    // Coordenadas de ejemplo para Lima (basadas en la ruta)
    if (route.id === "costa-verde") {
      return [
        [-12.1169, -77.0378], // Miraflores
        [-12.1211, -77.0336],
        [-12.1253, -77.0294],
        [-12.1295, -77.0252],
        [-12.1337, -77.021], // Barranco
      ]
    } else if (route.id === "parque-olivar") {
      return [
        [-12.0964, -77.0378], // Entrada El Olivar
        [-12.0986, -77.0356],
        [-12.1008, -77.0334],
        [-12.0986, -77.0312],
        [-12.0964, -77.0334],
        [-12.0964, -77.0378], // Vuelta a la entrada
      ]
    } else {
      return [
        [-12.1169, -77.0378], // Parque del Amor
        [-12.1211, -77.0356],
        [-12.1253, -77.0334],
        [-12.1295, -77.0312],
        [-12.1337, -77.029], // Larcomar
      ]
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Ver
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-xl">{route.name}</DialogTitle>
          <DialogDescription>
            Ruta de {route.distance} km • {route.difficulty} • UV {route.uvLevel}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto pr-2">
          <Tabs defaultValue="details" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="details" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Detalles</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Eventos</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="details" className="mt-0 h-full">
                <div className="flex flex-col gap-4">
                  {/* Imagen de la ruta */}
                  <div className="relative w-full h-64 rounded-lg border bg-muted overflow-hidden">
                    <Image
                      src={normalizedRouteImages[normalizeRouteName(route.name)] || route.image || "/placeholder.jpg"}
                      alt={route.name}
                      fill
                      className="object-cover"
                      style={{ objectPosition: "center" }}
                      sizes="(max-width: 800px) 100vw, 800px"
                      priority
                    />
                  </div>
                  <ScrollArea className="h-[450px] md:h-[500px]">
                    <div className="space-y-6 p-2 px-4 pr-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Tiempo estimado</p>
                            <p className="font-medium">{route.estimatedTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Elevación</p>
                            <p className="font-medium">{route.elevation} m</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-1">Descripción</h4>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{route.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-1">Terreno</h4>
                          <p className="text-sm text-muted-foreground">{route.terrain}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Puntos</h4>
                          <p className="text-sm text-muted-foreground">
                            <span className="block">Inicio: {route.startPoint}</span>
                            <span className="block">Fin: {route.endPoint}</span>
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-1">Mejor momento para correr</h4>
                        <div className="grid grid-cols-7 gap-1 text-xs">
                          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                            <div key={day} className="text-center">
                              <div className="font-medium">{day}</div>
                              <div className="mt-1 grid grid-rows-3 gap-1">
                                <div
                                  className={`rounded-sm p-1 ${Math.random() > 0.5 ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}
                                >
                                  AM
                                </div>
                                <div
                                  className={`rounded-sm p-1 ${Math.random() > 0.5 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-400"}`}
                                >
                                  MD
                                </div>
                                <div
                                  className={`rounded-sm p-1 ${Math.random() > 0.5 ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}
                                >
                                  PM
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          <span className="inline-block w-3 h-3 bg-emerald-100 rounded-sm mr-1"></span> Óptimo
                          <span className="inline-block w-3 h-3 bg-amber-100 rounded-sm mx-1 ml-2"></span> Moderado
                          <span className="inline-block w-3 h-3 bg-gray-100 rounded-sm mx-1 ml-2"></span> No recomendado
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-0 h-full">
                <ScrollArea className="h-[450px] md:h-[500px]">
                  {isLoading ? (
                    <div className="p-6 text-center text-muted-foreground text-base">Cargando eventos...</div>
                  ) : events.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground text-base">No hay próximos eventos registrados para esta ruta.</div>
                  ) : (
                    <div className="space-y-4">
                      {events.map((event, idx) => (
                        <div key={idx} className="p-4 border rounded">
                          <div className="font-semibold">{event.title}</div>
                          <div className="text-xs text-muted-foreground">{event.date} - {event.time}</div>
                          <div>{event.description}</div>
                          {/* Puedes agregar más detalles aquí */}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="flex flex-row gap-3 pt-2 border-t mt-2">
          {/* Botón Programar */}
          <Button variant="outline" size="default" className="gap-2" onClick={handleSchedule}>
            <Calendar className="h-4 w-4" />
            <span>Programar</span>
          </Button>
          {/* Botón Compartir estilo ClimaY */}
          <ShareRouteModal route={route} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Modal de compartir estilo ClimaY
import { Dialog as ShareDialog, DialogContent as ShareDialogContent, DialogHeader as ShareDialogHeader, DialogTitle as ShareDialogTitle, DialogTrigger as ShareDialogTrigger } from "@/components/ui/dialog"

function ShareRouteModal({ route }: { route: Route }) {
  const [copied, setCopied] = useState(false)
  const url = `https://meteolink.vercel.app/peru/lima/routes/${route.id}`
  const text = `¡Mira esta ruta para correr! 🏃‍♂️\n\n*${route.name}*\n📏 Distancia: ${route.distance} km\n⏱️ Tiempo estimado: ${route.estimatedTime}\n🌡️ Nivel UV: ${route.uvLevel}\n⛰️ Elevación: ${route.elevation} m\nDificultad: ${route.difficulty}\nTerreno: ${route.terrain}\nInicio: ${route.startPoint}\nFin: ${route.endPoint}\n\n${route.description}\n\nVer más en: ${url}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleShare = (platform: string) => {
    let shareUrl = ""
    if (platform === "whatsapp") {
      shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    } else if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    } else if (platform === "telegram") {
      shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
    window.open(shareUrl, "_blank")
  }

  return (
    <ShareDialog>
      <ShareDialogTrigger asChild>
        <Button variant="outline" size="default" className="gap-2 ml-auto">
          <ShareIcon className="h-4 w-4" />
          <span>Compartir</span>
        </Button>
      </ShareDialogTrigger>
      <ShareDialogContent className="max-w-xs max-h-[80vh] overflow-y-auto">
        <ShareDialogHeader>
          <ShareDialogTitle>Compartir ruta</ShareDialogTitle>
        </ShareDialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Mensaje</span>
            <textarea
              className="border rounded px-2 py-1 text-xs w-full bg-muted resize-none"
              value={text}
              readOnly
              rows={8}
            />
            <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-muted transition mt-1">
              {copied ? "¡Copiado!" : "Copiar mensaje"}
            </button>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <span className="text-xs text-muted-foreground">Redes sociales</span>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleShare("whatsapp")} className="bg-green-100 text-green-700 px-3 py-2 rounded flex items-center gap-2 text-xs hover:bg-green-200">
                <FaWhatsapp className="w-4 h-4" /> WhatsApp
              </button>
              <button onClick={() => handleShare("facebook")} className="bg-blue-100 text-blue-700 px-3 py-2 rounded flex items-center gap-2 text-xs hover:bg-blue-200">
                <FaFacebook className="w-4 h-4" /> Facebook
              </button>
              <button onClick={() => handleShare("twitter")} className="bg-sky-100 text-sky-700 px-3 py-2 rounded flex items-center gap-2 text-xs hover:bg-sky-200">
                <FaTwitter className="w-4 h-4" /> Twitter
              </button>
              <button onClick={() => handleShare("telegram")} className="bg-cyan-100 text-cyan-700 px-3 py-2 rounded flex items-center gap-2 text-xs hover:bg-cyan-200">
                <FaTelegram className="w-4 h-4" /> Telegram
              </button>
              <button onClick={() => handleShare("linkedin")} className="bg-blue-50 text-blue-900 px-3 py-2 rounded flex items-center gap-2 text-xs hover:bg-blue-100">
                <FaLinkedin className="w-4 h-4" /> LinkedIn
              </button>
            </div>
          </div>
        </div>
      </ShareDialogContent>
    </ShareDialog>
  )
}
