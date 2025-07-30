"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RouteDetailsDialog } from "@/components/route-details-dialog"
import { Sun, TrendingUp, Clock } from "lucide-react"

export function RoutesList() {
  const [loading, setLoading] = useState(true)
  const [routes, setRoutes] = useState<any[]>([])

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true)
      try {
        // Coordenadas por ruta
        const coords: Record<string, { lat: number; lon: number }> = {
          "costa-verde": { lat: -12.1372, lon: -77.0336 },
          "parque-olivar": { lat: -12.1022, lon: -77.0376 },
          "malecon-miraflores": { lat: -12.1277, lon: -77.0301 },
          "pentagonito": { lat: -12.0931, lon: -76.9916 },
          "circuito-magico": { lat: -12.0701, lon: -77.0336 },
        };
        // Datos de ejemplo
        const mockRoutes = [
          {
            id: "costa-verde",
            name: "Costa Verde",
            distance: 5.2,
            difficulty: "Intermedio",
            elevation: 120,
            estimatedTime: "30-40 min",
            description:
              "Ruta escénica a lo largo del litoral de Lima con vistas al océano Pacífico. Ideal para correr temprano en la mañana o al atardecer.",
            terrain: "Pavimento y senderos",
            startPoint: "Miraflores",
            endPoint: "Barranco",
            image: "/placeholder.svg?height=200&width=400",
          },
          {
            id: "parque-olivar",
            name: "Parque El Olivar",
            distance: 3.1,
            difficulty: "Fácil",
            elevation: 45,
            estimatedTime: "15-20 min",
            description:
              "Recorrido tranquilo entre olivos centenarios con abundante sombra. Perfecto para principiantes o para días con alto índice UV.",
            terrain: "Tierra compacta y césped",
            startPoint: "Entrada principal",
            endPoint: "Entrada principal",
            image: "/placeholder.svg?height=200&width=400",
          },
          {
            id: "malecon-miraflores",
            name: "Malecón de Miraflores",
            distance: 4.5,
            difficulty: "Intermedio",
            elevation: 85,
            estimatedTime: "25-35 min",
            description:
              "Ruta panorámica con vistas al mar y varios parques. Cuenta con estaciones de ejercicio y fuentes de agua en el camino.",
            terrain: "Pavimento",
            startPoint: "Parque del Amor",
            endPoint: "Larcomar",
            image: "/placeholder.svg?height=200&width=400",
          },
          {
            id: "pentagonito",
            name: "El Pentagonito",
            distance: 2.8,
            difficulty: "Fácil",
            elevation: 30,
            estimatedTime: "15-20 min",
            description:
              "Circuito popular entre corredores locales. Terreno plano ideal para entrenamientos de velocidad.",
            terrain: "Pavimento",
            startPoint: "Entrada San Borja",
            endPoint: "Entrada San Borja",
            image: "/placeholder.svg?height=200&width=400",
          },
          {
            id: "circuito-magico",
            name: "Circuito Mágico del Agua",
            distance: 3.0,
            difficulty: "Fácil",
            elevation: 25,
            estimatedTime: "15-20 min",
            description:
              "Recorrido alrededor del parque de las fuentes. Mejor por la mañana antes de la apertura al público.",
            terrain: "Pavimento",
            startPoint: "Entrada principal",
            endPoint: "Entrada principal",
            image: "/Circuito.jpg",
          },
        ];
        // Hacer solo una petición UV (usando la de Costa Verde como referencia)
        const refCoord = coords["costa-verde"];
        let uvIndex = undefined;
        try {
          const res = await fetch(`/api/openuv?lat=${refCoord.lat}&lon=${refCoord.lon}`);
          const uvData = await res.json();
          uvIndex = typeof uvData.uv === "number" ? uvData.uv : undefined;
        } catch (e) {}
        // Determinar nivel y color
        let uvLevel = "desconocido";
        let uvClass = "text-gray-500";
        if (uvIndex !== undefined) {
          if (uvIndex <= 2) { uvLevel = "bajo"; uvClass = "text-emerald-500"; }
          else if (uvIndex <= 5) { uvLevel = "moderado"; uvClass = "text-yellow-500"; }
          else if (uvIndex <= 7) { uvLevel = "alto"; uvClass = "text-orange-500"; }
          else { uvLevel = "muy alto"; uvClass = "text-red-500"; }
        }
        // Asignar el mismo UV a todas las rutas
        const routesWithUV = mockRoutes.map((route) => ({
          ...route,
          uvIndex,
          uvLevel,
          uvClass,
        }));
        setRoutes(routesWithUV)
      } catch (error) {
        setRoutes([])
      } finally {
        setLoading(false)
      }
    }
    fetchRoutes()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Distancia</TableHead>
            <TableHead>Dificultad</TableHead>
            <TableHead>UV</TableHead>
            <TableHead>Elevación</TableHead>
            <TableHead>Tiempo</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routes.map((route) => (
            <TableRow key={route.id}>
              <TableCell className="font-medium">{route.name}</TableCell>
              <TableCell>{route.distance} km</TableCell>
              <TableCell>{route.difficulty}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Sun className={`h-3.5 w-3.5 ${route.uvClass}`} />
                  <span className={route.uvClass}>{route.uvLevel}</span>
                  {route.uvIndex !== undefined && (
                    <span className="ml-1 text-xs font-semibold">({route.uvIndex})</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{route.elevation}m</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{route.estimatedTime}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <RouteDetailsDialog route={route} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
