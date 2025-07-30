"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRouter } from "next/navigation"

const cities = [
	{
		value: "lima",
		label: "Lima",
		country: "Peru",
	},
	{
		value: "arequipa",
		label: "Arequipa",
		country: "Peru",
	},
	{
		value: "trujillo",
		label: "Trujillo",
		country: "Peru",
	},
	{
		value: "cusco",
		label: "Cusco",
		country: "Peru",
	},
	{
		value: "piura",
		label: "Piura",
		country: "Peru",
	},
	{
		value: "chiclayo",
		label: "Chiclayo",
		country: "Peru",
	},
	{
		value: "iquitos",
		label: "Iquitos",
		country: "Peru",
	},
	{
		value: "huancayo",
		label: "Huancayo",
		country: "Peru",
	},
]

interface CitySelectorProps {
	value: string
	setValue: (value: string) => void
}

export function CitySelector({ value, setValue }: CitySelectorProps) {
	const [open, setOpen] = useState(false)
	const selectedCity = cities.find((city) => city.value === value)

	const handleSelect = (currentValue: string) => {
		setValue(currentValue)
		setOpen(false)
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
					<div className="flex items-center gap-2">
						<MapPin className="h-4 w-4 text-primary" />
						{selectedCity?.label || "Seleccionar ciudad"}
					</div>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Buscar ciudad..." />
					<CommandList>
						<CommandEmpty>No se encontraron ciudades.</CommandEmpty>
						<CommandGroup>
							{cities.map((city) => (
								<CommandItem key={city.value} value={city.value} onSelect={handleSelect}>
									<Check className={cn("mr-2 h-4 w-4", value === city.value ? "opacity-100" : "opacity-0")} />
									{city.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
