"use client"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import React from "react"

export function CalendarHeader() {
  // Estado local para mostrar el mes actual
  const [month, setMonth] = React.useState(() => {
    const now = new Date()
    return now.toLocaleString("es-ES", { month: "long", year: "numeric" })
  })

  // Cambiar la fecha del calendario al primer día del mes actual
  const handleMonthClick = () => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    window.dispatchEvent(new CustomEvent("calendar-set-date", { detail: firstDay }))
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => window.dispatchEvent(new CustomEvent('calendar-today'))}>
        Hoy
      </Button>
      <Button variant="outline" size="sm" onClick={handleMonthClick}>
        <Calendar className="h-4 w-4 mr-1" />
        {month.charAt(0).toUpperCase() + month.slice(1)}
      </Button>
    </div>
  )
}
