"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Map as LeafletMap, LatLngExpression } from "leaflet"

// Lazy load Leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false
  }
)

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
)

interface RouteMapProps {
  coordinates: [number, number][]
  routeName: string
}

interface MapRef {
  invalidateSize: () => void
}

export function RouteMap({ coordinates, routeName }: Readonly<RouteMapProps>) {
  const mapRef = useRef<LeafletMap | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoize center calculation
  const center = useCallback((): LatLngExpression => {
    if (!coordinates.length) return [-12.1169, -77.0378] // Default to Lima center
    
    const sumLat = coordinates.reduce((sum, coord) => sum + coord[0], 0)
    const sumLng = coordinates.reduce((sum, coord) => sum + coord[1], 0)
    const count = coordinates.length
    
    return [sumLat / count, sumLng / count]
  }, [coordinates])

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fix Leaflet icon issue
        delete (L.Icon.Default.prototype as any)._getIconUrl

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
        })

        setIsLoading(false)
      } catch (error) {
        setError("Error al cargar el mapa")
        setIsLoading(false)
      }
    }

    initMap()
  }, [])

  // Handle map resize
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />
  }

  if (error) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <MapContainer
      center={center()}
      zoom={15}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      whenCreated={(map: LeafletMap) => {
        mapRef.current = map
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Start marker */}
      <Marker position={coordinates[0]}>
        <Popup>
          <strong>Inicio:</strong> {routeName}
        </Popup>
      </Marker>

      {/* End marker */}
      <Marker position={coordinates[coordinates.length - 1]}>
        <Popup>
          <strong>Fin:</strong> {routeName}
        </Popup>
      </Marker>

      {/* Route line */}
      <Polyline 
        positions={coordinates} 
        pathOptions={{
          color: "#3b82f6",
          weight: 5,
          opacity: 0.7
        }}
        eventHandlers={{
          click: () => {
            if (mapRef.current) {
              mapRef.current.fitBounds(coordinates)
            }
          }
        }}
      />
    </MapContainer>
  )
}
