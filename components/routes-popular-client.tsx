"use client";
import { fetchWeatherData, getUVIndex } from "@/lib/api";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { RouteDetailsDialog } from "@/components/route-details-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FaWhatsapp, FaFacebook, FaTwitter, FaTelegram, FaLinkedin } from "react-icons/fa";

const ROUTE_COORDS: Record<"costa-verde" | "parque-olivar" | "malecon-miraflores", { lat: number; lon: number }> = {
  "costa-verde": { lat: -12.1211, lon: -77.0336 },
  "parque-olivar": { lat: -12.0964, lon: -77.0378 },
  "malecon-miraflores": { lat: -12.1295, lon: -77.0312 },
};

interface Route {
  id: string;
  name: string;
  distance: number;
  uvLevel: string;
  uvClass: string;
  difficulty: string;
  elevation: number;
  estimatedTime: string;
  description: string;
  terrain: string;
  startPoint: string;
  endPoint: string;
  image: string;
}

interface UvData {
  [routeId: string]: {
    uv: number;
    uvLevel: string;
    uvClass: string;
  };
}

function getUvLevel(uv: number): { level: string; class: string } {
  if (uv <= 2) return { level: "bajo", class: "text-emerald-500" };
  if (uv <= 5) return { level: "moderado", class: "text-amber-500" };
  if (uv <= 7) return { level: "alto", class: "text-orange-500" };
  if (uv <= 10) return { level: "muy alto", class: "text-red-500" };
  return { level: "extremo", class: "text-purple-700" };
}

function getShareUrl(city: string, country: string) {
  if (typeof window !== "undefined") {
    const url = window.location.href;
    // Si es localhost, reemplaza por dominio real
    return url.replace("localhost:3000", "meteolink.com");
  }
  return `https://meteolink.com/${country.toLowerCase()}/${city.toLowerCase()}`;
}

export function ShareButton({ city, country, aqi, uv }: { city: string; country: string; aqi?: number | null; uv?: number | null }) {
  const [copied, setCopied] = useState(false);
  const url = getShareUrl(city, country);
  const text = `Clima en ${city}, ${country} | AQI: ${aqi ?? "-"} | UV: ${uv ?? "-"} | Ver más en ${url}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = async (platform: "whatsapp" | "facebook") => {
    let shareUrl = "";
    if (platform === "whatsapp") {
      shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    } else if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    }
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="flex gap-2">
      <button
        className="border rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-muted transition"
        onClick={handleCopy}
        title="Copiar link"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16h8a2 2 0 002-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" /></svg>
        {copied ? "¡Copiado!" : "Copiar link"}
      </button>
      <button
        className="border rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-green-100 text-green-700 transition"
        onClick={() => handleShare("whatsapp")}
        title="Compartir por WhatsApp"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A12.07 12.07 0 0012 0C5.37 0 0 5.37 0 12a12 12 0 001.67 6.13L0 24l6.37-1.67A12 12 0 0012 24c6.63 0 12-5.37 12-12a12.07 12.07 0 00-3.48-8.52zM12 22a10 10 0 01-5.19-1.44l-.37-.22-3.78 1 1-3.67-.24-.38A10 10 0 1122 12c0 5.52-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.54-.45-.47-.62-.48-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.04 2.81 1.19 3 .15.19 2.05 3.13 5.01 4.27.7.24 1.25.38 1.68.49.71.18 1.36.15 1.87.09.57-.07 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" /></svg>
        WhatsApp
      </button>
      <button
        className="border rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-blue-100 text-blue-700 transition"
        onClick={() => handleShare("facebook")}
        title="Compartir en Facebook"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" /></svg>
        Facebook
      </button>
    </div>
  );
}

// AQI automático desde WeatherAPI
export function ShareModalButton({ city, country }: { city: string; country: string }) {
  const [weather, setWeather] = useState<{ temp: number | null; humidity: number | null; wind: number | null; uv: number | null; aqi: number | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const url = getShareUrl(city, country);

  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      let uv = null;
      let aqi = null;
      let temp = null;
      let humidity = null;
      let wind = null;
      // 1. AQI y clima principal desde WAQI
      try {
        const waqiRes = await fetch(`https://api.waqi.info/feed/${city}/?token=4f1b553e55fdcf6a01cc7b23c99da238fe9b2c21`);
        const waqi = await waqiRes.json();
        if (waqi.status === "ok") {
          aqi = waqi.data.aqi ?? null;
          temp = waqi.data.iaqi?.t?.v ?? null;
          humidity = waqi.data.iaqi?.h?.v ?? null;
          wind = waqi.data.iaqi?.w?.v ?? null;
          // Colorear AQI según valor estándar
          // 0-50: verde, 51-100: amarillo, 101-150: naranja, 151-200: rojo, 201-300: morado, >300: marrón
        }
      } catch {}
      // 2. UV: WeatherAPI y OpenUV como backup
      try {
        const weather = await fetchWeatherData(city, country);
        uv = weather.uvIndex ?? null;
        if ((!uv || uv === 0) && weather.lat && weather.lon) {
          try {
            const uvData = await getUVIndex(weather.lat, weather.lon);
            uv = uvData.uv ?? null;
          } catch {}
        }
      } catch {}
      if (mounted) {
        setWeather({ temp, humidity, wind, uv, aqi });
      }
      setLoading(false);
    }
    fetchAll();
    return () => { mounted = false; };
  }, [city, country]);

  const text = `Clima en ${city}, ${country}\n\n• Temperatura: ${weather?.temp ?? "-"}°C\n• Humedad: ${weather?.humidity ?? "-"}%\n• Viento: ${weather?.wind ?? "-"} km/h\n• Índice UV: ${weather?.uv ?? "-"}\n• Calidad del aire (AQI): ${weather?.aqi ?? "-"}\n\nVer más detalles y rutas en: ${url}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = (platform: string) => {
    let shareUrl = "";
    if (platform === "whatsapp") {
      shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    } else if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    } else if (platform === "telegram") {
      shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    }
    window.open(shareUrl, "_blank");
  };

  const getAqiSource = (aqi: number | null) => {
    if (aqi == null) return "-";
    if (aqi > 6) return "WAQI";
    return "WeatherAPI";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="border rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-muted transition">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12v.01M8 12v.01M12 12v.01M16 12v.01M20 12v.01" /></svg>
          Compartir
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-xs max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compartir</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Mensaje</span>
            <textarea
              className="border rounded px-2 py-1 text-xs w-full bg-muted resize-none"
              value={text}
              readOnly
              rows={7}
            />
            <button onClick={handleCopy} className="text-xs px-2 py-1 border rounded hover:bg-muted transition mt-1">
              {copied ? "¡Copiado!" : "Copiar mensaje"}
            </button>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <span className="text-xs text-muted-foreground">Redes sociales</span>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleShare("whatsapp")} className="bg-green-100 text-green-700 px-3 py-2 rounded flex items-center gap-2 text-xs hover:bg-green-200">
                <FaWhatsapp className="w-4 h-4" /> WhatsApp
              </button>
              <button onClick={() => handleShare("facebook")} className="bg-blue-100 text-blue-700 px-3 py-2 rounded flex items-center gap-2 text-xs hover:bg-blue-200">
                <FaFacebook className="w-4 h-4" /> Facebook
              </button>
              <button onClick={() => handleShare("twitter")} className="bg-sky-100 text-sky-700 px-3 py-2 rounded flex items-center gap-2 text-xs hover:bg-sky-200">
                <FaTwitter className="w-4 h-4" /> Twitter
              </button>
              <button onClick={() => handleShare("telegram")} className="bg-cyan-100 text-cyan-700 px-3 py-2 rounded flex items-center gap-2 text-xs hover:bg-cyan-200">
                <FaTelegram className="w-4 h-4" /> Telegram
              </button>
              <button onClick={() => handleShare("linkedin")} className="bg-blue-50 text-blue-900 px-3 py-2 rounded flex items-center gap-2 text-xs hover:bg-blue-100">
                <FaLinkedin className="w-4 h-4" /> LinkedIn
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function RoutesPopularClient({ routes }: { routes: Route[] }) {
  const [routesUv, setRoutesUv] = useState<UvData>({});
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRoutesUv() {
      const uvData: UvData = {};
      for (const route of routes) {
        const coords = ROUTE_COORDS[route.id as keyof typeof ROUTE_COORDS];
        if (coords) {
          try {
            const uv = await fetch(`/api/openuv?lat=${coords.lat}&lon=${coords.lon}`)
              .then((res) => res.json())
              .then((data) => typeof data.uv === "number" ? data.uv : 0);
            const { level, class: uvClass } = getUvLevel(uv);
            uvData[route.id] = { uv, uvLevel: level, uvClass };
          } catch {
            uvData[route.id] = { uv: 0, uvLevel: "-", uvClass: "text-muted-foreground" };
          }
        } else {
          uvData[route.id] = { uv: 0, uvLevel: "-", uvClass: "text-muted-foreground" };
        }
      }
      setRoutesUv(uvData);
    }
    fetchRoutesUv();
  }, [routes]);

  useEffect(() => {
    // Cargar eventos reales desde la API local para Lima, Perú
    fetch('/api/events?city=Lima&country=Peru')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(() => setEvents([]));
  }, []);

  return (
    <div className="space-y-2">
      {routes.map((route) => (
        <div key={route.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
          <div>
            <div className="font-semibold">
              {route.name}
              <span className="ml-2 inline-block px-2 py-0.5 rounded bg-muted text-xs font-normal align-middle">
                {route.distance} km
              </span>
              <span className={`ml-2 text-xs font-medium align-middle ${routesUv[route.id]?.uvClass ?? route.uvClass}`}>
                UV {routesUv[route.id]?.uvLevel ?? route.uvLevel}
              </span>
            </div>
            {/* Eventos para esta ruta */}
            <div className="mt-1">
              {events.filter(e => e.routeId === route.id).length === 0 ? (
                <span className="text-xs text-muted-foreground">No hay eventos próximos para esta ruta.</span>
              ) : (
                <ul className="text-xs text-muted-foreground list-disc ml-4">
                  {events.filter(e => e.routeId === route.id).map((event, idx) => (
                    <li key={idx}>
                      <span className="font-medium text-foreground">{event.title}</span> - {event.date} {event.time && `- ${event.time}`}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <RouteDetailsDialog route={route} />
        </div>
      ))}
    </div>
  );
}