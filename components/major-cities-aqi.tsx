// components/major-cities-aqi.tsx

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AQIBadge from "./aqi-badge" // Check this path carefully if errors persist
import { Loader2 } from "lucide-react"

interface CityAQI {
  name: string
  lat: number
  lon: number
  aqi: number | null
  loading: boolean
}

const MAJOR_INDIAN_CITIES = [
  { name: "Delhi", lat: 28.7041, lon: 77.1025 },
  { name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { name: "Bangalore", lat: 12.9716, lon: 77.5946 },
  { name: "Hyderabad", lat: 17.385, lon: 78.4867 },
  { name: "Chennai", lat: 13.0827, lon: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { name: "Pune", lat: 18.5204, lon: 73.8567 },
  { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
]

export default function MajorCitiesAQI() {
  const [cities, setCities] = useState<CityAQI[]>(
    MAJOR_INDIAN_CITIES.map((city) => ({
      ...city,
      aqi: null,
      loading: true,
    })),
  )

  useEffect(() => {
    const fetchAllCitiesAQI = async () => {
      const updatedCities = await Promise.all(
        cities.map(async (city) => {
          try {
            // ⭐ CRITICAL FIX: Calling the internal Next.js API route (/api/aqi)
            // This leverages the OpenWeatherMap key you successfully configured.
            const response = await fetch(
              `/api/aqi?lat=${city.lat}&lon=${city.lon}`
            )
            
            if (!response.ok) {
                // If the internal route returns an error status (e.g., 401, 500)
                const errorData = await response.json();
                console.error(`API Route Error for ${city.name}:`, errorData.error);
                throw new Error(`Failed to fetch AQI data for ${city.name}`);
            }

            const data = await response.json()

            // Extracting the 'aqi' property from the local route response (OpenWeatherMap 1-5 scale)
            return {
              ...city,
              aqi: data.aqi, 
              loading: false,
            }
          } catch (err) {
            console.error(`Failed to fetch AQI for ${city.name}:`, err)
            return { ...city, loading: false }
          }
        }),
      )
      setCities(updatedCities)
    }

    fetchAllCitiesAQI()
  }, [])

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Major Indian Cities AQI</CardTitle>
        <CardDescription>Real-time air quality index across India</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cities.map((city) => (
            <div
              key={city.name}
              className="flex flex-col items-center gap-3 p-4 bg-secondary rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-foreground text-center">{city.name}</h3>
              {city.loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              ) : city.aqi !== null ? (
                <AQIBadge aqi={city.aqi} size="small" />
              ) : (
                <p className="text-xs text-muted-foreground">Unable to load</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}