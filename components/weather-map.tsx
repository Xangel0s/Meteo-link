"use client"

import { useRef, useEffect } from "react"

export function WeatherMap() {
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

    // Dibujar un mapa meteorológico simplificado
    const drawMap = () => {
      if (!ctx) return

      // Limpiar el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Dibujar fondo (mapa base)
      ctx.fillStyle = "#f1f5f9" // slate-100
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dibujar contorno de Perú (simplificado)
      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.3, canvas.height * 0.1)
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.1)
      ctx.lineTo(canvas.width * 0.7, canvas.height * 0.3)
      ctx.lineTo(canvas.width * 0.7, canvas.height * 0.7)
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.9)
      ctx.lineTo(canvas.width * 0.3, canvas.height * 0.7)
      ctx.lineTo(canvas.width * 0.2, canvas.height * 0.4)
      ctx.closePath()
      ctx.fillStyle = "#e2e8f0" // slate-200
      ctx.fill()
      ctx.strokeStyle = "#94a3b8" // slate-400
      ctx.lineWidth = 2
      ctx.stroke()

      // Dibujar océano
      ctx.fillStyle = "#bae6fd" // light-blue-200
      ctx.fillRect(0, 0, canvas.width * 0.2, canvas.height)
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.1)
      ctx.fillRect(canvas.width * 0.7, 0, canvas.width * 0.3, canvas.height)
      ctx.fillRect(0, canvas.height * 0.9, canvas.width, canvas.height * 0.1)

      // Dibujar ciudades
      const cities = [
        { name: "Lima", x: canvas.width * 0.25, y: canvas.height * 0.5 },
        { name: "Arequipa", x: canvas.width * 0.4, y: canvas.height * 0.7 },
        { name: "Cusco", x: canvas.width * 0.5, y: canvas.height * 0.6 },
        { name: "Trujillo", x: canvas.width * 0.3, y: canvas.height * 0.3 },
        { name: "Piura", x: canvas.width * 0.25, y: canvas.height * 0.2 },
      ]

      cities.forEach((city) => {
        // Punto de la ciudad
        ctx.beginPath()
        ctx.arc(city.x, city.y, 5, 0, Math.PI * 2)
        ctx.fillStyle = "#1e293b" // slate-800
        ctx.fill()

        // Nombre de la ciudad
        ctx.font = "12px Inter, system-ui, sans-serif"
        ctx.fillStyle = "#1e293b" // slate-800
        ctx.textAlign = "center"
        ctx.fillText(city.name, city.x, city.y - 10)
      })

      // Dibujar patrones de clima (nubes, lluvia, sol)
      // Nubes en el norte
      drawCloud(ctx, canvas.width * 0.25, canvas.height * 0.15, 20)
      drawCloud(ctx, canvas.width * 0.35, canvas.height * 0.2, 25)

      // Sol en el centro
      drawSun(ctx, canvas.width * 0.5, canvas.height * 0.4, 15)

      // Lluvia en el sur
      drawRain(ctx, canvas.width * 0.4, canvas.height * 0.75, 30)
      drawRain(ctx, canvas.width * 0.5, canvas.height * 0.8, 25)

      // Leyenda
      drawLegend(ctx, canvas)
    }

    const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath()
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2)
      ctx.arc(x + size * 0.4, y - size * 0.2, size * 0.6, 0, Math.PI * 2)
      ctx.arc(x + size * 0.8, y, size * 0.4, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(203, 213, 225, 0.8)" // slate-300 with opacity
      ctx.fill()
    }

    const drawSun = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      // Sol
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = "#fbbf24" // amber-400
      ctx.fill()

      // Rayos
      ctx.strokeStyle = "#f59e0b" // amber-500
      ctx.lineWidth = 2
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const x1 = x + Math.cos(angle) * size
        const y1 = y + Math.sin(angle) * size
        const x2 = x + Math.cos(angle) * (size * 1.5)
        const y2 = y + Math.sin(angle) * (size * 1.5)

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
    }

    const drawRain = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      // Nube
      drawCloud(ctx, x, y - size * 0.5, size)

      // Gotas de lluvia
      ctx.strokeStyle = "#3b82f6" // blue-500
      ctx.lineWidth = 2

      for (let i = 0; i < 5; i++) {
        const dropX = x + (i - 2) * (size * 0.2)
        const dropY1 = y
        const dropY2 = y + size * 0.4

        ctx.beginPath()
        ctx.moveTo(dropX, dropY1)
        ctx.lineTo(dropX, dropY2)
        ctx.stroke()
      }
    }

    const drawLegend = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const legendX = canvas.width * 0.05
      const legendY = canvas.height * 0.85
      const itemHeight = 25

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.fillRect(legendX - 10, legendY - 10, 150, 100)
      ctx.strokeStyle = "#94a3b8" // slate-400
      ctx.strokeRect(legendX - 10, legendY - 10, 150, 100)

      // Título
      ctx.font = "bold 12px Inter, system-ui, sans-serif"
      ctx.fillStyle = "#1e293b" // slate-800
      ctx.textAlign = "left"
      ctx.fillText("Leyenda", legendX, legendY)

      // Elementos
      ctx.font = "12px Inter, system-ui, sans-serif"

      // Nubes
      drawCloud(ctx, legendX + 10, legendY + itemHeight, 10)
      ctx.fillStyle = "#1e293b" // slate-800
      ctx.fillText("Nublado", legendX + 30, legendY + itemHeight + 5)

      // Sol
      drawSun(ctx, legendX + 10, legendY + itemHeight * 2, 8)
      ctx.fillStyle = "#1e293b" // slate-800
      ctx.fillText("Soleado", legendX + 30, legendY + itemHeight * 2 + 5)

      // Lluvia
      drawRain(ctx, legendX + 10, legendY + itemHeight * 3, 15)
      ctx.fillStyle = "#1e293b" // slate-800
      ctx.fillText("Lluvia", legendX + 30, legendY + itemHeight * 3 + 5)
    }

    drawMap()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="h-full w-full rounded-md overflow-hidden relative">
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }}></canvas>
    </div>
  )
}
