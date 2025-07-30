"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, Umbrella, Clock, Shirt, Droplets } from "lucide-react"

export function UVProtectionGuide() {
  const protectionLevels = [
    {
      level: "Bajo (0-2)",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: Shield,
      recommendations: [
        "Puedes estar al aire libre con seguridad",
        "Usa gafas de sol en días brillantes",
        "Cubre tu piel si te quemas fácilmente",
      ],
    },
    {
      level: "Moderado (3-5)",
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: Shield,
      recommendations: [
        "Permanece en la sombra durante las horas centrales del día",
        "Usa protector solar SPF 30+",
        "Usa sombrero y ropa que cubra brazos y piernas",
      ],
    },
    {
      level: "Alto (6-7)",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: Umbrella,
      recommendations: [
        "Reduce la exposición entre las 10am y 4pm",
        "Usa protector solar SPF 30+ y reaplica cada 2 horas",
        "Usa sombrero de ala ancha y gafas de sol con protección UV",
      ],
    },
    {
      level: "Muy Alto (8-10)",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: Clock,
      recommendations: [
        "Minimiza la exposición al sol entre 10am y 4pm",
        "Usa protector solar SPF 50+ y reaplica cada 2 horas",
        "Usa ropa de manga larga, pantalones largos y sombrero",
      ],
    },
    {
      level: "Extremo (11+)",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: Shirt,
      recommendations: [
        "Evita la exposición al sol entre 10am y 4pm",
        "Usa protector solar SPF 50+ y reaplica cada hora",
        "Usa ropa protectora, sombrero y gafas de sol",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Sigue estas recomendaciones según el nivel de índice UV para protegerte adecuadamente durante tus actividades al
        aire libre.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {protectionLevels.map((level, index) => {
          const Icon = level.icon
          return (
            <Card key={index} className={`border-2 ${level.color}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-full ${level.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{level.level}</h3>
                </div>
                <ul className="space-y-2">
                  {level.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Droplets className="h-4 w-4 mt-0.5 shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="rounded-lg border p-4 bg-blue-50 text-blue-800 border-blue-200">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Droplets className="h-5 w-5" /> Consejos generales para runners
        </h4>
        <ul className="space-y-1 text-sm">
          <li>• Programa tus carreras temprano en la mañana o al atardecer cuando el índice UV es más bajo</li>
          <li>• Usa ropa técnica con protección UV y de colores claros</li>
          <li>• Aplica protector solar resistente al agua y al sudor</li>
          <li>• Mantente hidratado y lleva agua contigo</li>
          <li>• Elige rutas con sombra cuando el índice UV sea alto</li>
        </ul>
      </div>
    </div>
  )
}
