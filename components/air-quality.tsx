"use client";
import { Droplets } from "lucide-react";
import { useEffect, useState } from "react";

const WAQI_TOKEN = "4f1b553e55fdcf6a01cc7b23c99da238fe9b2c21";
const LAT = -12.0464;
const LON = -77.0428;

// Simple in-memory cache para calidad del aire
const airQualityCache: Record<string, { data: number; timestamp: number; source?: 'weatherapi' | 'waqi' }> = {};
const AIR_CACHE_DURATION = 35 * 60 * 1000; // 35 minutos

function getAqiColor(aqi: number) {
  if (aqi == null) return "text-muted-foreground";
  if (aqi <= 50) return "text-emerald-500"; // Bueno
  if (aqi <= 100) return "text-yellow-500"; // Moderado
  if (aqi <= 150) return "text-orange-500"; // Dañino para grupos sensibles
  if (aqi <= 200) return "text-red-500"; // Dañino
  if (aqi <= 300) return "text-purple-700"; // Muy dañino
  return "text-rose-900"; // Peligroso
}

function getAqiBg(aqi: number) {
  if (aqi == null) return "bg-muted-foreground/20";
  if (aqi <= 50) return "bg-emerald-500/20";
  if (aqi <= 100) return "bg-yellow-500/20";
  if (aqi <= 150) return "bg-orange-500/20";
  if (aqi <= 200) return "bg-red-500/20";
  if (aqi <= 300) return "bg-purple-700/20";
  return "bg-rose-900/20";
}

function getAqiLabel(aqi: number) {
  if (aqi == null) return "Sin datos";
  if (aqi <= 50) return "Bueno";
  if (aqi <= 100) return "Moderado";
  if (aqi <= 150) return "Dañino para grupos sensibles";
  if (aqi <= 200) return "Dañino";
  if (aqi <= 300) return "Muy dañino";
  return "Peligroso";
}

export function AirQuality() {
  const [aqi, setAqi] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'weatherapi' | 'waqi' | null>(null);

  useEffect(() => {
    const cacheKey = "lima";
    const now = Date.now();
    if (airQualityCache[cacheKey] && now - airQualityCache[cacheKey].timestamp < AIR_CACHE_DURATION) {
      setAqi(airQualityCache[cacheKey].data);
      setSource(airQualityCache[cacheKey].source || null);
      setLoading(false);
      return;
    }
    // Solo WAQI
    fetch(`https://api.waqi.info/feed/lima/?token=${WAQI_TOKEN}`)
      .then((res) => res.json())
      .then((waqi: any) => {
        if (waqi && waqi.status === "ok" && typeof waqi.data.aqi === "number") {
          airQualityCache[cacheKey] = { data: waqi.data.aqi, timestamp: now, source: 'waqi' };
          setAqi(waqi.data.aqi);
          setSource('waqi');
        } else {
          setAqi(null);
          setSource(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setAqi(null);
        setSource(null);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-muted-foreground">Índice de calidad del aire</p>
        <p className="text-3xl font-bold">
          {loading ? (
            <span className="animate-pulse text-muted-foreground">...</span>
          ) : (
            aqi ?? "-"
          )}
        </p>
        <p className={aqi ? getAqiColor(aqi) : "text-muted-foreground"}>
          {loading ? (
            <span className="animate-pulse">Cargando...</span>
          ) : aqi ? (
            getAqiLabel(aqi)
          ) : (
            "Sin datos"
          )}
        </p>
        {source === 'waqi' && !loading && aqi && (
          <p className="text-xs text-muted-foreground mt-1">Fuente: WAQI</p>
        )}
      </div>
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-full transition-colors duration-300 ${getAqiBg(aqi ?? 0)}`}
      >
        <Droplets className={`h-10 w-10 transition-colors duration-300 ${getAqiColor(aqi ?? 0)}`} />
      </div>
    </div>
  );
}
