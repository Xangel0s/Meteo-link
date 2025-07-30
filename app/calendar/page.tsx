import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EventCalendar } from "@/components/event-calendar"
import { EventList } from "@/components/event-list"
import { EventFilter } from "@/components/event-filter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, List, Filter } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarHeader } from "@/components/calendar-header"

export default function CalendarPage() {
  return (
    <main className="flex min-h-screen flex-col space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="sm" asChild className="mr-1 p-0 h-8 w-8">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Volver</span>
              </Link>
            </Button>
            <h1 className="text-3xl font-bold leading-tight tracking-tighter">Calendario</h1>
          </div>
          <p className="text-muted-foreground">Eventos y carreras programadas</p>
        </div>
        <div className="flex gap-2">
          <CalendarHeader />
        </div>
      </div>

      {/* Event Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filtrar eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EventFilter />
        </CardContent>
      </Card>

      {/* Tabs for different calendar views */}
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Calendario</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>Lista</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Calendario de eventos
              </CardTitle>
              <CardDescription>Mayo 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <EventCalendar />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <List className="h-5 w-5 text-primary" />
                Lista de eventos
              </CardTitle>
              <CardDescription>Próximos eventos</CardDescription>
            </CardHeader>
            <CardContent>
              <EventList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
