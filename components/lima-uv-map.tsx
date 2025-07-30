"use client";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";
import { useEffect, useState } from "react";

// Polígono principal: Lima Metropolitana (aproximado)
const uvHighZones = [
  [
    { lat: -11.95, lng: -77.15 }, // Noroeste
    { lat: -11.95, lng: -76.95 }, // Noreste
    { lat: -12.18, lng: -76.95 }, // Sureste
    { lat: -12.18, lng: -77.15 }, // Suroeste
  ]
];

export function LimaUvMap() {
  // Solo renderizar en el cliente para evitar errores de hidratación
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) return <div style={{height: "500px", width: "100%", minHeight: 400}} />;
  return (
    <div style={{ height: "500px", width: "100%", position: "relative", zIndex: 1, minHeight: 400 }}>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "AIzaSyC_TsvwmwHp8YRmjeo1P3G00gvMp7tp2iE"}>
        <GoogleMap
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={{ lat: -12.0464, lng: -77.0428 }}
          zoom={11}
        >
          {uvHighZones.map((zone, idx) => (
            <Polygon
              key={idx}
              paths={zone}
              options={{
                fillColor: "#FF5722",
                fillOpacity: 0.4,
                strokeColor: "#FF5722",
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
