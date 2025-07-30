"use client"

import { Calendar, Home, Umbrella, Sun, Activity, Map, Settings, Cloud, Thermometer, X } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Badge } from "@/components/ui/badge"

export function AppSidebar() {
  const pathname = usePathname()
  const { setOpenMobile, setOpen, isMobile } = useSidebar()

  const topMenuItems = [
    {
      title: "Inicio",
      url: "/",
      icon: Home,
      exact: true,
    },
    {
      title: "Pronóstico",
      url: "/peru/lima",
      icon: Umbrella,
      exact: false,
    },
    {
      title: "Índice UV",
      url: "/uv-index",
      icon: Sun,
      exact: true,
      badge: "Alto",
    },
    {
      title: "Clima",
      url: "/weather",
      icon: Cloud,
      exact: true,
    },
    {
      title: "Temperatura",
      url: "/temperature",
      icon: Thermometer,
      exact: true,
    },
  ]

  const runnerMenuItems = [
    {
      title: "Para runners",
      url: "/runner",
      icon: Activity,
      exact: true,
    },
    {
      title: "Mapa de rutas",
      url: "/routes",
      icon: Map,
      exact: true,
    },
    {
      title: "Calendario",
      url: "/calendar",
      icon: Calendar,
      exact: true,
    },
  ]

  const isActive = (item: { url: string; exact: boolean }) => {
    if (item.exact) {
      return pathname === item.url
    }
    return pathname.startsWith(item.url)
  }

  return (
    <>
      <SidebarTrigger />
      <Sidebar className="border-l border-border bg-background text-foreground z-50">
        <SidebarHeader className="py-4 relative">
          {/* Botón de cierre en la esquina superior derecha */}
          <button
            type="button"
            aria-label="Cerrar sidebar"
            onClick={() => {
              setOpenMobile(false)
              setOpen(false)
            }}
            className="absolute top-2 right-2 p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center px-2">
            <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-xl font-bold text-primary-foreground">M</span>
            </div>
            <span className="text-xl font-bold">MeteoLink</span>
          </div>
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              <Cloud className="text-primary" />
              Clima y Pronóstico
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {topMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item)}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge variant="destructive" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>
              <Activity className="text-primary" />
              Para deportistas
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {runnerMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item)}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="mt-auto">
          <SidebarGroup>
            <SidebarGroupLabel>
              <Settings className="text-primary" />
              Configuración
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="flex items-center space-x-2 px-2">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
