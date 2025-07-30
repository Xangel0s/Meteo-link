"use client"

import { useRef, useEffect } from "react"

interface TemperatureMapProps {
  city: string
  country: string
}

export function TemperatureMap({ city, country }: TemperatureMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajustar el tamaño del canvas
    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Dibujar un mapa de temperatura simplificado
    const drawMap = () => {
      if (!ctx) return

      // Limpiar el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Dibujar fondo (mapa base)
      ctx.fillStyle = "#f1f5f9" // slate-100
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dibujar contorno de la ciudad (simplificado)
      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.1, canvas.height * 0.3)
      ctx.lineTo(canvas.width * 0.3, canvas.height * 0.1)
      ctx.lineTo(canvas.width * 0.7, canvas.height * 0.2)
      ctx.lineTo(canvas.width * 0.9, canvas.height * 0.4)
      ctx.lineTo(canvas.width * 0.8, canvas.height * 0.8)
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.9)
      ctx.lineTo(canvas.width * 0.2, canvas.height * 0.7)
      ctx.closePath()
      ctx.fillStyle = "#e2e8f0" // slate-200
      ctx.fill()
      ctx.strokeStyle = "#94a3b8" // slate-400
      ctx.lineWidth = 2
      ctx.stroke()

      // Dibujar zonas de temperatura
      const zones = [
        { name: "Centro", x: canvas.width * 0.5, y: canvas.height * 0.5, temp: 24, radius: 80 },
        { name: "Norte", x: canvas.width * 0.4, y: canvas.height * 0.2, temp: 26, radius: 70 },
        { name: "Sur", x: canvas.width * 0.6, y: canvas.height * 0.7, temp: 22, radius: 75 },
        { name: "Este", x: canvas.width * 0.8, y: canvas.height * 0.5, temp: 25, radius: 65 },
        { name: "Oeste", x: canvas.width * 0.2, y: canvas.height * 0.5, temp: 21, radius: 60 },
      ]

      zones.forEach((zone) => {
        // Gradiente de temperatura
        const gradient = ctx.createRadialGradient(zone.x, zone.y, 0, zone.x, zone.y, zone.radius)

        // Color basado en la temperatura
        let color
        if (zone.temp <= 18)
          color = "rgba(59, 130, 246, 0.6)" // blue-500
        else if (zone.temp <= 22)
          color = "rgba(16, 185, 129, 0.6)" // emerald-500
        else if (zone.temp <= 26)
          color = "rgba(245, 158, 11, 0.6)" // amber-500
        else if (zone.temp <= 30)
          color = "rgba(249, 115, 22, 0.6)" // orange-500
        else color = "rgba(239, 68, 68, 0.6)" // red-500

        gradient.addColorStop(0, color)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2)
        ctx.fill()

        // Temperatura
        ctx.font = "bold 14px Inter, system-ui, sans-serif"
        ctx.fillStyle = "#1e293b" // slate-800
        ctx.textAlign = "center"
        ctx.fillText(`${zone.temp}°C`, zone.x, zone.y)

        // Nombre de la zona
        ctx.font = "12px Inter, system-ui, sans-serif"
        ctx.fillStyle = "#1e293b" // slate-800
        ctx.fillText(zone.name, zone.x, zone.y + 20)
      })

      // Leyenda
      drawLegend(ctx, canvas)
    }

    const drawLegend = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const legendX = canvas.width * 0.05
      const legendY = canvas.height * 0.85
      const itemHeight = 25
      const itemWidth = 20

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.fillRect(legendX - 10, legendY - 10, 180, 120)
      ctx.strokeStyle = "#94a3b8" // slate-400
      ctx.strokeRect(legendX - 10, legendY - 10, 180, 120)

      // Título
      ctx.font = "bold 12px Inter, system-ui, sans-serif"
      ctx.fillStyle = "#1e293b" // slate-800
      ctx.textAlign = "left"
      ctx.fillText("Temperatura", legendX, legendY)

      // Elementos
      ctx.font = "12px Inter, system-ui, sans-serif"

      // Frío
      ctx.fillStyle = "rgba(59, 130, 246, 0.8)" // blue-500
      ctx.fillRect(legendX, legendY + itemHeight, itemWidth, itemHeight / 2)
      ctx.fillStyle = "#1e293b" // slate-800
      ctx.fillText("< 18°C (Frío)", legendX + itemWidth + 10, legendY + itemHeight + 10)

      // Fresco
      ctx.fillStyle = "rgba(16, 185, 129, 0.8)" // emerald-500
      ctx.fillRect(legendX, legendY + itemHeight * 1.7, itemWidth, itemHeight / 2)
      ctx.fillStyle = "#1e293b" // slate-800
      ctx.fillText("18-22°C (Fresco)", legendX + itemWidth + 10, legendY + itemHeight * 1.7 + 10)

      // Templado
      ctx.fillStyle = "rgba(245, 158, 11, 0.8)" // amber-500
      ctx.fillRect(legendX, legendY + itemHeight * 2.4, itemWidth, itemHeight / 2)
      ctx.fillStyle = "#1e293b" // slate-800
      ctx.fillText("22-26°C (Templado)", legendX + itemWidth + 10, legendY + itemHeight * 2.4 + 10)

      // Cálido
      ctx.fillStyle = "rgba(249, 115, 22, 0.8)" // orange-500
      ctx.fillRect(legendX, legendY + itemHeight * 3.1, itemWidth, itemHeight / 2)
      ctx.fillStyle = "#1e293b" // slate-800
      ctx.fillText("26-30°C (Cálido)", legendX + itemWidth + 10, legendY + itemHeight * 3.1 + 10)

      // Caluroso
      ctx.fillStyle = "rgba(239, 68, 68, 0.8)" // red-500
      ctx.fillRect(legendX, legendY + itemHeight * 3.8, itemWidth, itemHeight / 2)
      ctx.fillStyle = "#1e293b" // slate-800
      ctx.fillText("> 30°C (Caluroso)", legendX + itemWidth + 10, legendY + itemHeight * 3.8 + 10)
    }

    drawMap()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [city, country])

  return (
    <div className="h-full w-full rounded-md overflow-hidden relative">
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }}></canvas>
    </div>
  )
}
