import { Metadata } from "next"

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: "website" | "article"
}

interface WeatherForecastData {
  location: string
  country: string
  forecast: Array<{
    date: string
    temperature: number
    humidity: number
    windSpeed: number
    uvIndex: number
  }>
}

interface EventData {
  title: string
  date: string
  endDate: string
  location: string
  description: string
  organizer: string
}

interface RouteData {
  name: string
  description: string
  distance: number
  elevation: number
  difficulty: string
  estimatedTime: string
  startPoint: string
  endPoint: string
}

interface WebSiteData {
  name: string
  description: string
  url: string
  potentialAction: {
    "@type": "SearchAction"
    target: string
    "query-input": string
  }
}

type StructuredDataType = "WeatherForecast" | "Event" | "Route" | "WebSite"
type StructuredData = WeatherForecastData | EventData | RouteData | WebSiteData

export function generateSEO({
  title,
  description,
  keywords = [],
  image = "/og-image.jpg",
  url = "https://meteo.app",
  type = "website"
}: SEOProps): Metadata {
  const siteName = "Meteo - Pronóstico del Clima en Perú"
  const fullTitle = `${title} | ${siteName}`

  return {
    title: fullTitle,
    description,
    keywords: [
      "clima",
      "pronóstico del tiempo",
      "temperatura",
      "humedad",
      "radiación UV",
      "Perú",
      "Lima",
      ...keywords
    ].join(", "),
    authors: [{ name: "Meteo Team" }],
    creator: "Meteo",
    publisher: "Meteo",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@meteoapp",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "google-site-verification-code",
    },
  }
}

export function generateStructuredData({
  type,
  data,
}: {
  type: StructuredDataType
  data: StructuredData
}) {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
  }

  switch (type) {
    case "WeatherForecast": {
      const weatherData = data as WeatherForecastData
      return {
        ...baseData,
        location: {
          "@type": "Place",
          name: weatherData.location,
          address: {
            "@type": "PostalAddress",
            addressCountry: weatherData.country,
          },
        },
        forecast: weatherData.forecast.map((day) => ({
          "@type": "WeatherForecast",
          date: day.date,
          temperature: {
            "@type": "QuantitativeValue",
            value: day.temperature,
            unitCode: "CEL",
          },
          humidity: {
            "@type": "QuantitativeValue",
            value: day.humidity,
            unitCode: "PER",
          },
          windSpeed: {
            "@type": "QuantitativeValue",
            value: day.windSpeed,
            unitCode: "KMH",
          },
          uvIndex: day.uvIndex,
        })),
      }
    }

    case "Event": {
      const eventData = data as EventData
      return {
        ...baseData,
        name: eventData.title,
        startDate: eventData.date,
        endDate: eventData.endDate,
        location: {
          "@type": "Place",
          name: eventData.location,
          address: {
            "@type": "PostalAddress",
            addressCountry: "Perú",
          },
        },
        description: eventData.description,
        organizer: {
          "@type": "Organization",
          name: eventData.organizer,
        },
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      }
    }

    case "Route": {
      const routeData = data as RouteData
      return {
        ...baseData,
        name: routeData.name,
        description: routeData.description,
        distance: {
          "@type": "QuantitativeValue",
          value: routeData.distance,
          unitCode: "KMT",
        },
        elevation: {
          "@type": "QuantitativeValue",
          value: routeData.elevation,
          unitCode: "MTR",
        },
        difficulty: routeData.difficulty,
        estimatedTime: routeData.estimatedTime,
        startPoint: {
          "@type": "Place",
          name: routeData.startPoint,
        },
        endPoint: {
          "@type": "Place",
          name: routeData.endPoint,
        },
      }
    }

    case "WebSite": {
      const websiteData = data as WebSiteData
      return {
        ...baseData,
        name: websiteData.name,
        description: websiteData.description,
        url: websiteData.url,
        potentialAction: websiteData.potentialAction,
      }
    }

    default:
      return baseData
  }
} 