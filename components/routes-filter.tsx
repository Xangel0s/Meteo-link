"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { MapPin, Sun, TrendingUp, Clock, Filter, X } from "lucide-react"

export function RoutesFilter() {
  const [distance, setDistance] = useState([0, 10])
  const [elevation, setElevation] = useState([0, 200])
  const [duration, setDuration] = useState([0, 60])
  const [uvLevels, setUvLevels] = useState<string[]>([])
  const [terrainTypes, setTerrainTypes] = useState<string[]>([])
  const [difficulties, setDifficulties] = useState<string[]>([])
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleUvLevelChange = (level: string) => {
    if (uvLevels.includes(level)) {
      setUvLevels(uvLevels.filter((l) => l !== level))
      setActiveFilters(activeFilters.filter((f) => f !== `UV: ${level}`))
    } else {
      setUvLevels([...uvLevels, level])
      setActiveFilters([...activeFilters, `UV: ${level}`])
    }
  }

  const handleTerrainChange = (terrain: string) => {
    if (terrainTypes.includes(terrain)) {
      setTerrainTypes(terrainTypes.filter((t) => t !== terrain))
      setActiveFilters(activeFilters.filter((f) => f !== `Terreno: ${terrain}`))
    } else {
      setTerrainTypes([...terrainTypes, terrain])
      setActiveFilters([...activeFilters, `Terreno: ${terrain}`])
    }
  }

  const handleDifficultyChange = (difficulty: string) => {
    if (difficulties.includes(difficulty)) {
      setDifficulties(difficulties.filter((d) => d !== difficulty))
      setActiveFilters(activeFilters.filter((f) => f !== `Dificultad: ${difficulty}`))
    } else {
      setDifficulties([...difficulties, difficulty])
      setActiveFilters([...activeFilters, `Dificultad: ${difficulty}`])
    }
  }

  const handleDistanceChange = (value: number[]) => {
    setDistance(value)

    // Actualizar filtro activo
    const distanceFilter = `Distancia: ${value[0]}-${value[1]} km`
    const existingIndex = activeFilters.findIndex((f) => f.startsWith("Distancia:"))

    if (existingIndex >= 0) {
      const newFilters = [...activeFilters]
      newFilters[existingIndex] = distanceFilter
      setActiveFilters(newFilters)
    } else {
      setActiveFilters([...activeFilters, distanceFilter])
    }
  }

  const handleElevationChange = (value: number[]) => {
    setElevation(value)

    // Actualizar filtro activo
    const elevationFilter = `Elevación: ${value[0]}-${value[1]} m`
    const existingIndex = activeFilters.findIndex((f) => f.startsWith("Elevación:"))

    if (existingIndex >= 0) {
      const newFilters = [...activeFilters]
      newFilters[existingIndex] = elevationFilter
      setActiveFilters(newFilters)
    } else {
      setActiveFilters([...activeFilters, elevationFilter])
    }
  }

  const handleDurationChange = (value: number[]) => {
    setDuration(value)

    // Actualizar filtro activo
    const durationFilter = `Duración: ${value[0]}-${value[1]} min`
    const existingIndex = activeFilters.findIndex((f) => f.startsWith("Duración:"))

    if (existingIndex >= 0) {
      const newFilters = [...activeFilters]
      newFilters[existingIndex] = durationFilter
      setActiveFilters(newFilters)
    } else {
      setActiveFilters([...activeFilters, durationFilter])
    }
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))

    // Eliminar el filtro correspondiente
    if (filter.startsWith("UV:")) {
      const level = filter.split(": ")[1]
      setUvLevels(uvLevels.filter((l) => l !== level))
    } else if (filter.startsWith("Terreno:")) {
      const terrain = filter.split(": ")[1]
      setTerrainTypes(terrainTypes.filter((t) => t !== terrain))
    } else if (filter.startsWith("Dificultad:")) {
      const difficulty = filter.split(": ")[1]
      setDifficulties(difficulties.filter((d) => d !== difficulty))
    }
    // Los filtros de rango se manejan de forma diferente, no los reseteamos aquí
  }

  const clearAllFilters = () => {
    setDistance([0, 10])
    setElevation([0, 200])
    setDuration([0, 60])
    setUvLevels([])
    setTerrainTypes([])
    setDifficulties([])
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Distancia */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <Label>Distancia (km)</Label>
          </div>
          <Slider
            defaultValue={[0, 10]}
            max={10}
            step={0.5}
            value={distance}
            onValueChange={handleDistanceChange}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{distance[0]} km</span>
            <span>{distance[1]} km</span>
          </div>
        </div>

        {/* Elevación */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <Label>Elevación (m)</Label>
          </div>
          <Slider
            defaultValue={[0, 200]}
            max={200}
            step={10}
            value={elevation}
            onValueChange={handleElevationChange}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{elevation[0]} m</span>
            <span>{elevation[1]} m</span>
          </div>
        </div>

        {/* Duración */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <Label>Duración (min)</Label>
          </div>
          <Slider
            defaultValue={[0, 60]}
            max={60}
            step={5}
            value={duration}
            onValueChange={handleDurationChange}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{duration[0]} min</span>
            <span>{duration[1]} min</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Nivel UV */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-primary" />
            <Label>Nivel UV</Label>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uv-bajo"
                checked={uvLevels.includes("bajo")}
                onCheckedChange={() => handleUvLevelChange("bajo")}
              />
              <label
                htmlFor="uv-bajo"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Bajo
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uv-moderado"
                checked={uvLevels.includes("moderado")}
                onCheckedChange={() => handleUvLevelChange("moderado")}
              />
              <label
                htmlFor="uv-moderado"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Moderado
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uv-alto"
                checked={uvLevels.includes("alto")}
                onCheckedChange={() => handleUvLevelChange("alto")}
              />
              <label
                htmlFor="uv-alto"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Alto
              </label>
            </div>
          </div>
        </div>

        {/* Tipo de terreno */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <Label>Tipo de terreno</Label>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terreno-pavimento"
                checked={terrainTypes.includes("pavimento")}
                onCheckedChange={() => handleTerrainChange("pavimento")}
              />
              <label
                htmlFor="terreno-pavimento"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Pavimento
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terreno-tierra"
                checked={terrainTypes.includes("tierra")}
                onCheckedChange={() => handleTerrainChange("tierra")}
              />
              <label
                htmlFor="terreno-tierra"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Tierra
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terreno-mixto"
                checked={terrainTypes.includes("mixto")}
                onCheckedChange={() => handleTerrainChange("mixto")}
              />
              <label
                htmlFor="terreno-mixto"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Mixto
              </label>
            </div>
          </div>
        </div>

        {/* Dificultad */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <Label>Dificultad</Label>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dificultad-facil"
                checked={difficulties.includes("Fácil")}
                onCheckedChange={() => handleDifficultyChange("Fácil")}
              />
              <label
                htmlFor="dificultad-facil"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Fácil
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dificultad-intermedio"
                checked={difficulties.includes("Intermedio")}
                onCheckedChange={() => handleDifficultyChange("Intermedio")}
              />
              <label
                htmlFor="dificultad-intermedio"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Intermedio
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dificultad-dificil"
                checked={difficulties.includes("Difícil")}
                onCheckedChange={() => handleDifficultyChange("Difícil")}
              />
              <label
                htmlFor="dificultad-dificil"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Difícil
              </label>
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
