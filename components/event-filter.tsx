"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Calendar, MapPin, Medal, Filter, X } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"

export function EventFilter() {
  const [eventTypes, setEventTypes] = useState<string[]>([])
  const [distances, setDistances] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleEventTypeChange = (type: string) => {
    if (eventTypes.includes(type)) {
      setEventTypes(eventTypes.filter((t) => t !== type))
      setActiveFilters(activeFilters.filter((f) => f !== `Tipo: ${type}`))
    } else {
      setEventTypes([...eventTypes, type])
      setActiveFilters([...activeFilters, `Tipo: ${type}`])
    }
  }

  const handleDistanceChange = (distance: string) => {
    if (distances.includes(distance)) {
      setDistances(distances.filter((d) => d !== distance))
      setActiveFilters(activeFilters.filter((f) => f !== `Distancia: ${distance}`))
    } else {
      setDistances([...distances, distance])
      setActiveFilters([...activeFilters, `Distancia: ${distance}`])
    }
  }

  const handleLocationChange = (location: string) => {
    if (locations.includes(location)) {
      setLocations(locations.filter((l) => l !== location))
      setActiveFilters(activeFilters.filter((f) => f !== `Ubicación: ${location}`))
    } else {
      setLocations([...locations, location])
      setActiveFilters([...activeFilters, `Ubicación: ${location}`])
    }
  }

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date)

    // Actualizar filtro activo
    if (date) {
      const dateFilter = `Desde: ${date.toLocaleDateString()}`
      const existingIndex = activeFilters.findIndex((f) => f.startsWith("Desde:"))

      if (existingIndex >= 0) {
        const newFilters = [...activeFilters]
        newFilters[existingIndex] = dateFilter
        setActiveFilters(newFilters)
      } else {
        setActiveFilters([...activeFilters, dateFilter])
      }
    } else {
      setActiveFilters(activeFilters.filter((f) => !f.startsWith("Desde:")))
    }
  }

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date)

    // Actualizar filtro activo
    if (date) {
      const dateFilter = `Hasta: ${date.toLocaleDateString()}`
      const existingIndex = activeFilters.findIndex((f) => f.startsWith("Hasta:"))

      if (existingIndex >= 0) {
        const newFilters = [...activeFilters]
        newFilters[existingIndex] = dateFilter
        setActiveFilters(newFilters)
      } else {
        setActiveFilters([...activeFilters, dateFilter])
      }
    } else {
      setActiveFilters(activeFilters.filter((f) => !f.startsWith("Hasta:")))
    }
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))

    // Eliminar el filtro correspondiente
    if (filter.startsWith("Tipo:")) {
      const type = filter.split(": ")[1]
      setEventTypes(eventTypes.filter((t) => t !== type))
    } else if (filter.startsWith("Distancia:")) {
      const distance = filter.split(": ")[1]
      setDistances(distances.filter((d) => d !== distance))
    } else if (filter.startsWith("Ubicación:")) {
      const location = filter.split(": ")[1]
      setLocations(locations.filter((l) => l !== location))
    } else if (filter.startsWith("Desde:")) {
      setStartDate(undefined)
    } else if (filter.startsWith("Hasta:")) {
      setEndDate(undefined)
    }
  }

  const clearAllFilters = () => {
    setEventTypes([])
    setDistances([])
    setLocations([])
    setStartDate(undefined)
    setEndDate(undefined)
    setActiveFilters([])
  }

  return (
    <div className="space-y-6">
      {/* Filtros activos */}
      {activeFilters.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Filtros activos</h4>
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7 px-2 text-xs">
              Limpiar todos
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {filter}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter(filter)} />
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tipo de evento */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Medal className="h-4 w-4 text-primary" />
            <Label>Tipo de evento</Label>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tipo-maraton"
                checked={eventTypes.includes("Maratón")}
                onCheckedChange={() => handleEventTypeChange("Maratón")}
              />
              <label
                htmlFor="tipo-maraton"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Maratón
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tipo-media"
                checked={eventTypes.includes("Media Maratón")}
                onCheckedChange={() => handleEventTypeChange("Media Maratón")}
              />
              <label
                htmlFor="tipo-media"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Media Maratón
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tipo-carrera"
                checked={eventTypes.includes("Carrera")}
                onCheckedChange={() => handleEventTypeChange("Carrera")}
              />
              <label
                htmlFor="tipo-carrera"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Carrera
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tipo-entrenamiento"
                checked={eventTypes.includes("Entrenamiento")}
                onCheckedChange={() => handleEventTypeChange("Entrenamiento")}
              />
              <label
                htmlFor="tipo-entrenamiento"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Entrenamiento
              </label>
            </div>
          </div>
        </div>

        {/* Distancia */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <Label>Distancia</Label>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="distancia-5k"
                checked={distances.includes("5K")}
                onCheckedChange={() => handleDistanceChange("5K")}
              />
              <label
                htmlFor="distancia-5k"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                5K
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="distancia-10k"
                checked={distances.includes("10K")}
                onCheckedChange={() => handleDistanceChange("10K")}
              />
              <label
                htmlFor="distancia-10k"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                10K
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="distancia-21k"
                checked={distances.includes("21K")}
                onCheckedChange={() => handleDistanceChange("21K")}
              />
              <label
                htmlFor="distancia-21k"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                21K
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="distancia-42k"
                checked={distances.includes("42K")}
                onCheckedChange={() => handleDistanceChange("42K")}
              />
              <label
                htmlFor="distancia-42k"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                42K
              </label>
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <Label>Ubicación</Label>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ubicacion-lima"
                checked={locations.includes("Lima")}
                onCheckedChange={() => handleLocationChange("Lima")}
              />
              <label
                htmlFor="ubicacion-lima"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Lima
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ubicacion-callao"
                checked={locations.includes("Callao")}
                onCheckedChange={() => handleLocationChange("Callao")}
              />
              <label
                htmlFor="ubicacion-callao"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Callao
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ubicacion-costa-verde"
                checked={locations.includes("Costa Verde")}
                onCheckedChange={() => handleLocationChange("Costa Verde")}
              />
              <label
                htmlFor="ubicacion-costa-verde"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Costa Verde
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ubicacion-miraflores"
                checked={locations.includes("Miraflores")}
                onCheckedChange={() => handleLocationChange("Miraflores")}
              />
              <label
                htmlFor="ubicacion-miraflores"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Miraflores
              </label>
            </div>
          </div>
        </div>

        {/* Fechas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <Label>Rango de fechas</Label>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="start-date" className="text-xs">
                Desde
              </Label>
              <DatePicker
                id="start-date"
                selected={startDate}
                onSelect={handleStartDateChange}
                placeholder="Seleccionar fecha"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="end-date" className="text-xs">
                Hasta
              </Label>
              <DatePicker
                id="end-date"
                selected={endDate}
                onSelect={handleEndDateChange}
                placeholder="Seleccionar fecha"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="gap-2">
          <Filter className="h-4 w-4" />
          Aplicar filtros
        </Button>
      </div>
    </div>
  )
}
