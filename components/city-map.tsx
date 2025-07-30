"use client"

import { useRef, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { fetchMicroclimateData } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

interface CityMapProps {
  city: string
  country: string
}

interface MicroclimateData {
  district: string
  temperature: number
  uvIndex: number
  coordinates: [number, number]
}

export function CityMap({ city, country }: CityMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [microclimateData, setMicroclimateData] = useState<MicroclimateData[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredDistrict, setHoveredDistrict] = useState<MicroclimateData | null>(null)

  useEffect(() => {
    const getMicroclimateData = async () => {
      try {
        setLoading(true)
        const data = await fetchMicroclimateData(city, country)
        setMicroclimateData(data)
      } catch (error) {
        console.error("Error fetching microclimate data:", error)
        // Fallback data for Lima districts
        setMicroclimateData([
          { district: "Miraflores", temperature: 24, uvIndex: 8, coordinates: [200, 150] },
          { district: "San Isidro", temperature: 23, uvIndex: 7, coordinates: [180, 120] },
          { district: "Barranco", temperature: 25, uvIndex: 9, coordinates: [220, 180] },
          { district: "La Molina", temperature: 26, uvIndex: 10, coordinates: [300, 140] },
          { district: "San Borja", temperature: 24, uvIndex: 8, coordinates: [240, 130] },
          { district: "Surco", temperature: 25, uvIndex: 9, coordinates: [260, 160] },
          { district: "Callao", temperature: 22, uvIndex: 6, coordinates: [100, 80] },
          { district: "Centro de Lima", temperature: 23, uvIndex: 7, coordinates: [150, 100] },
        ])
      } finally {
        setLoading(false)
      }
    }

    getMicroclimateData()
  }, [city, country])

  useEffect(() => {
    if (!canvasRef.current || loading || microclimateData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Draw the map
    const drawMap = () => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background (simplified map of Lima)
      ctx.fillStyle = "#f1f5f9" // slate-100
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw coastline
      ctx.beginPath()
      ctx.moveTo(0, 100)
      ctx.bezierCurveTo(50, 120, 100, 150, 150, 170)
      ctx.bezierCurveTo(200, 190, 250, 200, 300, 210)
      ctx.lineTo(300, canvas.height)
      ctx.lineTo(0, canvas.height)
      ctx.closePath()
      ctx.fillStyle = "#bae6fd" // light-blue-200
      ctx.fill()

      // Draw districts with heatmap
      microclimateData.forEach((district) => {
        const [x, y] = district.coordinates

        // Draw district heat circle
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 40)

        // Color based on UV index
        let color
        if (district.uvIndex <= 2)
          color = "rgba(16, 185, 129, 0.6)" // emerald-500
        else if (district.uvIndex <= 5)
          color = "rgba(245, 158, 11, 0.6)" // amber-500
        else if (district.uvIndex <= 7)
          color = "rgba(249, 115, 22, 0.6)" // orange-500
        else if (district.uvIndex <= 10)
          color = "rgba(239, 68, 68, 0.6)" // red-500
        else color = "rgba(168, 85, 247, 0.6)" // purple-500

        gradient.addColorStop(0, color)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, 40, 0, Math.PI * 2)
        ctx.fill()

        // Draw district name
        ctx.fillStyle = "#1e293b" // slate-800
        ctx.font = "12px Inter, system-ui, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(district.district, x, y - 15)
      })
    }

    // Handle mouse movement for hover effect
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check if mouse is over any district
      let hoveredDistrict = null
      for (const district of microclimateData) {
        const [dx, dy] = district.coordinates
        const distance = Math.sqrt((x - dx) ** 2 + (y - dy) ** 2)

        if (distance < 40) {
          hoveredDistrict = district
          break
        }
      }

      setHoveredDistrict(hoveredDistrict)
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    // Initial draw
    drawMap()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [loading, microclimateData])

  if (loading) {
    return <Skeleton className="h-[500px] w-full" />
  }

  return (
    <Card>
      <CardContent className="p-0 relative h-[500px]">
        <canvas ref={canvasRef} className="w-full h-full rounded-md"></canvas>

        {hoveredDistrict && (
          <div className="absolute bg-card border shadow-sm rounded-md p-3 text-sm">
            <p className="font-semibold">{hoveredDistrict.district}</p>
            <p className="text-muted-foreground">Temperatura: {hoveredDistrict.temperature}°C</p>
            <p className="text-muted-foreground">Índice UV: {hoveredDistrict.uvIndex}</p>
          </div>
        )}

        <div className="absolute bottom-2 right-2 bg-card/90 p-2 rounded-md shadow-sm border text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span>UV Bajo (0-2)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span>UV Moderado (3-5)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>UV Alto (6-7)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>UV Muy Alto (8-10)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>UV Extremo (11+)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
