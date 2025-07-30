# 🌤️ Meteo-Link - Aplicación de Clima Inteligente

Una aplicación web moderna y optimizada para pronósticos meteorológicos, diseñada para ser una de las mejores páginas de clima en términos de velocidad y SEO.

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC)

## 🚀 Características Principales

### 🌡️ **Pronósticos Meteorológicos Completos**
- Pronóstico por hora y por día
- Temperatura, humedad, velocidad del viento
- Índice UV y recomendaciones de protección
- Calidad del aire en tiempo real
- Alertas meteorológicas

### 📊 **Visualizaciones Interactivas**
- Gráficos de temperatura y humedad
- Mapas interactivos con Leaflet
- Historial de UV con gráficos de área
- Estadísticas detalladas de temperatura

### 🏃‍♂️ **Funcionalidades para Runners**
- Rutas populares de running
- Recomendaciones basadas en el clima
- Calendario de eventos deportivos
- Mapas de rutas interactivos

### 🎯 **Optimización y SEO**
- Rendimiento optimizado con Next.js 15
- SEO completo con structured data
- Meta tags y Open Graph
- Lazy loading de componentes
- Caché inteligente de datos

### 📱 **Diseño Responsive**
- Interfaz moderna con Shadcn UI
- Tema claro/oscuro
- Diseño mobile-first
- Componentes accesibles

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 15.2.4
- **Lenguaje**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI
- **Charts**: Recharts
- **Maps**: Leaflet / React-Leaflet
- **Package Manager**: pnpm
- **API**: WeatherAPI, OpenUV

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- pnpm (recomendado) o npm

### Pasos de Instalación

1. **Clona el repositorio**
```bash
git clone https://github.com/Xangel0s/Meteo-link.git
cd Meteo-link
```

2. **Instala las dependencias**
```bash
pnpm install
# o
npm install
```

3. **Configura las variables de entorno**
Crea un archivo `.env.local` en la raíz del proyecto:
```env
NEXT_PUBLIC_WEATHER_API_KEY=tu_api_key_de_weatherapi
NEXT_PUBLIC_OPENUV_API_KEY=tu_api_key_de_openuv
```

4. **Ejecuta el servidor de desarrollo**
```bash
pnpm dev
# o
npm run dev
```

5. **Abre tu navegador**
Visita [http://localhost:3000](http://localhost:3000)

## 🔧 Configuración de APIs

### WeatherAPI
1. Regístrate en [WeatherAPI.com](https://www.weatherapi.com/)
2. Obtén tu API key gratuita
3. Agrega la key a `NEXT_PUBLIC_WEATHER_API_KEY`

### OpenUV (Opcional)
1. Regístrate en [OpenUV.io](https://www.openuv.io/)
2. Obtén tu API key
3. Agrega la key a `NEXT_PUBLIC_OPENUV_API_KEY`

## 📁 Estructura del Proyecto

```
meteo/
├── app/                    # App Router de Next.js
│   ├── [country]/[city]/   # Páginas dinámicas por ciudad
│   ├── api/               # API routes
│   ├── events/            # Página de eventos
│   ├── routes/            # Página de rutas
│   ├── runner/            # Página de runners
│   ├── temperature/       # Página de temperatura
│   ├── uv-index/          # Página de UV
│   └── weather/           # Página principal de clima
├── components/            # Componentes React
│   ├── ui/               # Componentes de Shadcn UI
│   ├── weather-dashboard.tsx
│   ├── hourly-forecast.tsx
│   ├── route-map.tsx
│   └── ...
├── lib/                  # Utilidades y APIs
│   ├── api.ts           # Funciones de API
│   ├── seo.ts           # Funciones de SEO
│   └── utils.ts         # Utilidades generales
├── hooks/               # Custom hooks
├── store/               # Estado global
├── styles/              # Estilos globales
└── public/              # Archivos estáticos
```

## 🎯 Características Destacadas

### ⚡ **Optimización de Rendimiento**
- Lazy loading de componentes pesados
- Memoización con `useMemo` y `useCallback`
- Caché de datos en localStorage
- Bundle splitting automático

### 🔍 **SEO Avanzado**
- Meta tags dinámicos
- Structured data (JSON-LD)
- Open Graph y Twitter Cards
- Sitemap automático
- Robots.txt optimizado

### 📊 **Visualizaciones de Datos**
- Gráficos de temperatura con Recharts
- Mapas interactivos con Leaflet
- Gráficos de UV con área sombreada
- Estadísticas en tiempo real

### 🏃‍♂️ **Funcionalidades para Deportistas**
- Recomendaciones de running basadas en clima
- Rutas populares con mapas
- Calendario de eventos deportivos
- Alertas de condiciones ideales

## 🚀 Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm lint         # Linting con ESLint
pnpm type-check   # Verificación de tipos TypeScript
```

## 📱 Páginas Disponibles

- **🏠 Home** (`/`) - Página principal con resumen
- **🌤️ Clima** (`/weather`) - Pronósticos detallados
- **🌡️ Temperatura** (`/temperature`) - Gráficos de temperatura
- **☀️ UV Index** (`/uv-index`) - Índice UV y protección
- **🏃‍♂️ Rutas** (`/routes`) - Rutas de running
- **📅 Eventos** (`/events`) - Eventos deportivos
- **🏃‍♀️ Runner** (`/runner`) - Herramientas para runners
- **🌍 Ciudad** (`/[country]/[city]`) - Clima por ciudad específica

## 🔧 Configuración Avanzada

### Personalización de Temas
Los temas se pueden personalizar en `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      // Tus colores personalizados
    }
  }
}
```

### Configuración de SEO
Las configuraciones de SEO se manejan en `lib/seo.ts`:
```typescript
export const generateSEO = (props: SEOProps): Metadata => {
  // Configuración personalizada de SEO
}
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [WeatherAPI](https://www.weatherapi.com/) por los datos meteorológicos
- [OpenUV](https://www.openuv.io/) por los datos de UV
- [Next.js](https://nextjs.org/) por el framework
- [Shadcn UI](https://ui.shadcn.com/) por los componentes
- [Recharts](https://recharts.org/) por las visualizaciones
- [Leaflet](https://leafletjs.com/) por los mapas

## 📞 Contacto

- **Autor**: Xangel0s
- **GitHub**: [@Xangel0s](https://github.com/Xangel0s)
- **Repositorio**: [Meteo-Link](https://github.com/Xangel0s/Meteo-link)

---

⭐ **¡Si te gusta este proyecto, dale una estrella en GitHub!** 