"use client"

import { useEffect, useRef } from "react"

interface RouteMapFallbackProps {
  coordinates: [number, number][]
  routeName: string
}

const RouteMapFallback = ({ coordinates, routeName }: RouteMapFallbackProps) => {
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

    // Dibujar un mapa simplificado
    const drawMap = () => {
      if (!ctx) return

      // Limpiar el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Dibujar fondo
      ctx.fillStyle = "#f3f4f6" // bg-gray-100
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Calcular límites para escalar las coordenadas al canvas
      const minLat = Math.min(...coordinates.map((coord) => coord[0]))
      const maxLat = Math.max(...coordinates.map((coord) => coord[0]))
      const minLng = Math.min(...coordinates.map((coord) => coord[1]))
      const maxLng = Math.max(...coordinates.map((coord) => coord[1]))

      // Añadir un margen
      const latMargin = (maxLat - minLat) * 0.2
      const lngMargin = (maxLng - minLng) * 0.2

      // Función para convertir coordenadas geográficas a coordenadas del canvas
      const toCanvasCoords = (lat: number, lng: number) => {
        const x = ((lng - minLng + lngMargin / 2) / (maxLng - minLng + lngMargin)) * canvas.width
        const y = ((lat - minLat + latMargin / 2) / (maxLat - minLat + latMargin)) * canvas.height
        return [x, y]
      }

      // Dibujar la ruta
      ctx.beginPath()
      coordinates.forEach((coord, i) => {
        const [x, y] = toCanvasCoords(coord[0], coord[1])
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.strokeStyle = "#3b82f6" // text-blue-500
      ctx.lineWidth = 4
      ctx.stroke()

      // Dibujar puntos de inicio y fin
      const [startX, startY] = toCanvasCoords(coordinates[0][0], coordinates[0][1])
      const [endX, endY] = toCanvasCoords(
        coordinates[coordinates.length - 1][0],
        coordinates[coordinates.length - 1][1],
      )

      // Punto de inicio (verde)
      ctx.beginPath()
      ctx.arc(startX, startY, 8, 0, Math.PI * 2)
      ctx.fillStyle = "#10b981" // text-emerald-500
      ctx.fill()
      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      ctx.stroke()

      // Punto de fin (rojo)
      ctx.beginPath()
      ctx.arc(endX, endY, 8, 0, Math.PI * 2)
      ctx.fillStyle = "#ef4444" // text-red-500
      ctx.fill()
      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      ctx.stroke()

      // Añadir etiquetas
      ctx.font = "14px Inter, system-ui, sans-serif"
      ctx.fillStyle = "#1f2937" // text-gray-800
      ctx.textAlign = "center"
      ctx.fillText("Inicio", startX, startY - 15)
      ctx.fillText("Fin", endX, endY - 15)

      // Añadir nombre de la ruta
      ctx.font = "16px Inter, system-ui, sans-serif"
      ctx.fillStyle = "#1f2937" // text-gray-800
      ctx.textAlign = "center"
      ctx.fillText(`Ruta: ${routeName}`, canvas.width / 2, 30)

      // Añadir nota
      ctx.font = "12px Inter, system-ui, sans-serif"
      ctx.fillStyle = "#6b7280" // text-gray-500
      ctx.textAlign = "center"
      ctx.fillText("Vista simplificada del mapa", canvas.width / 2, canvas.height - 20)
    }

    drawMap()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [coordinates, routeName])

  return (
    <div className="h-full w-full rounded-md overflow-hidden relative">
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }}></canvas>
    </div>
  )
}

export default RouteMapFallback
