"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  id?: string
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ id, selected, onSelect, placeholder = "Seleccionar fecha", className }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(selected)
  const [open, setOpen] = React.useState(false)

  // Actualizar el estado interno cuando cambia la prop selected
  React.useEffect(() => {
    setDate(selected)
  }, [selected])

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    onSelect?.(newDate)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: es }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={handleSelect} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
