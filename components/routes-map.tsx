"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Sun, TrendingUp, Clock, ChevronRight } from "lucide-react"

export function RoutesMap() {
  const [selectedRoute, setSelectedRoute] = React.useState<any>(null)

  // Rutas de ejemplo
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
      color: "#3b82f6", // blue-500
      coordinates: [
        { x: 0.25, y: 0.5 },
        { x: 0.3, y: 0.55 },
        { x: 0.35, y: 0.6 },
        { x: 0.4, y: 0.65 },
        { x: 0.45, y: 0.7 },
      ],
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
      color: "#10b981", // emerald-500
      coordinates: [
        { x: 0.6, y: 0.3 },
        { x: 0.65, y: 0.25 },
        { x: 0.7, y: 0.3 },
        { x: 0.65, y: 0.35 },
        { x: 0.6, y: 0.3 },
      ],
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
      color: "#f97316", // orange-500
      coordinates: [
        { x: 0.2, y: 0.2 },
        { x: 0.25, y: 0.25 },
        { x: 0.3, y: 0.3 },
        { x: 0.35, y: 0.35 },
        { x: 0.4, y: 0.4 },
      ],
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
      color: "#a855f7", // purple-500
      coordinates: [
        { x: 0.7, y: 0.7 },
        { x: 0.75, y: 0.65 },
        { x: 0.8, y: 0.7 },
        { x: 0.75, y: 0.75 },
        { x: 0.7, y: 0.7 },
      ],
    },
  ]

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <img
        src="/mapa-lima-metropolitana.jpg"
        alt="Mapa de Lima Metropolitana"
        className="w-full h-[600px] object-cover rounded-md border"
        style={{ maxWidth: 900 }}
      />
      {/* Si quieres mostrar detalles de ruta seleccionada, puedes mantener el Card aquí */}
      {selectedRoute && (
        <Card className="absolute bottom-4 right-4 w-72 shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold">{selectedRoute.name}</h4>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedRoute.color }}></div>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {selectedRoute.distance} km
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Sun className="h-3 w-3" />
                <span className={selectedRoute.uvClass}>UV {selectedRoute.uvLevel}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {selectedRoute.elevation}m
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {selectedRoute.estimatedTime}
              </Badge>
            </div>
            <Button size="sm" className="w-full gap-1">
              Ver detalles
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
