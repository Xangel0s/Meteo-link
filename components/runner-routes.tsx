"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { RouteDetailsDialog } from "@/components/route-details-dialog"
import { Button } from "@/components/ui/button"
import { MapPin, Sun, TrendingUp, Clock } from "lucide-react"

interface RunnerRoutesProps {
  city: string
  country: string
}

export function RunnerRoutes({ city, country }: RunnerRoutesProps) {
  const [loading, setLoading] = useState(true)
  const [routes, setRoutes] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true)
      try {
        // Obtener UV real de la API para la ciudad seleccionada
        let uvIndex = undefined;
        try {
          // Coordenadas por ciudad
          const coords: Record<string, { lat: number; lon: number }> = {
            lima: { lat: -12.0464, lon: -77.0428 },
            arequipa: { lat: -16.409, lon: -71.537 },
            trujillo: { lat: -8.111, lon: -79.028 },
            cusco: { lat: -13.532, lon: -71.967 },
            piura: { lat: -5.194, lon: -80.632 },
            chiclayo: { lat: -6.771, lon: -79.840 },
            iquitos: { lat: -3.749, lon: -73.253 },
            huancayo: { lat: -12.065, lon: -75.204 },
          };
          const cityKey = city.toLowerCase();
          const coord = coords[cityKey] || coords.lima;
          const res = await fetch(`/api/openuv?lat=${coord.lat}&lon=${coord.lon}`);
          const uvData = await res.json();
          uvIndex = typeof uvData.uv === "number" ? uvData.uv : undefined;
        } catch {}
        // Datos de ejemplo
        const mockRoutes = [
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
            image: "/costa verde.jpg",
            uvIndex,
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
            uvIndex,
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
            uvIndex,
          },
          {
            id: "pentagonito",
            name: "El Pentagonito",
            distance: 2.8,
            uvLevel: "moderado",
            uvClass: "text-amber-500",
            difficulty: "Fácil",
            elevation: 30,
            estimatedTime: "15-20 min",
            description:
              "Circuito popular entre corredores locales. Terreno plano ideal para entrenamientos de velocidad.",
            terrain: "Pavimento",
            startPoint: "Entrada San Borja",
            endPoint: "Entrada San Borja",
            image: "/penta.jpg",
            uvIndex,
          },
        ]
        setRoutes(mockRoutes)
      } catch (error) {
        console.error("Error fetching routes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoutes()

    // Cargar eventos desde la API
    fetch('/api/events?city=' + encodeURIComponent(city) + '&country=' + encodeURIComponent(country))
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(() => setEvents([]));
  }, [city, country])

  const getUVLevel = (uv: number | undefined) => {
    if (uv === undefined) return { level: "desconocido", class: "text-gray-500" };
    if (uv <= 2) return { level: "bajo", class: "text-emerald-500" };
    if (uv <= 5) return { level: "moderado", class: "text-yellow-500" };
    if (uv <= 7) return { level: "alto", class: "text-orange-500" };
    return { level: "muy alto", class: "text-red-500" };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Mostrar rutas */}
      {routes.map((route) => {
        const uvInfo = getUVLevel(route.uvIndex);
        return (
          <Card key={route.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="h-32 md:h-full bg-muted">
                  <img src={route.image || "/placeholder.svg"} alt={route.name} className="h-full w-full object-cover" />
                </div>
                <div className="col-span-2 p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{route.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {route.distance} km
                      </Badge>
                      <Badge variant="outline" className={`flex items-center gap-1 ${uvInfo.class}`}>
                        <Sun className="h-3 w-3" />
                        <span>UV {uvInfo.level}</span>
                        {route.uvIndex !== undefined && (
                          <span className="ml-1 text-xs font-semibold">({route.uvIndex})</span>
                        )}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {route.elevation}m
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {route.estimatedTime}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{route.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Dificultad: </span>
                      <span className="font-medium">{route.difficulty}</span>
                    </div>
                    <RouteDetailsDialog route={route} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Mostrar eventos del calendario */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Eventos próximos</h2>
        {events.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">No hay eventos registrados próximamente.</div>
        ) : (
          <div className="space-y-2">
            {events.map((event, idx) => (
              <Card key={idx} className="p-4">
                <div className="font-semibold">{event.title}</div>
                <div className="text-xs text-muted-foreground">{event.date} - {event.time}</div>
                <div>{event.description}</div>
                {event.participants && (
                  <div className="text-xs mt-1">{event.participants} participantes</div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
