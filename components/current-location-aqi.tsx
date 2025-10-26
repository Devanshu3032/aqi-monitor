// components/current-location-aqi.tsx

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AQIBadge from "./aqi-badge" // This path is now confirmed to be correct
import { MapPin, Loader2 } from "lucide-react"

interface CurrentLocationAQIProps {
  onAQIUpdate: (aqi: number) => void
  onLocationUpdate: (location: string) => void
}

export default function CurrentLocationAQI({ onAQIUpdate, onLocationUpdate }: CurrentLocationAQIProps) {
  const [aqi, setAQI] = useState<number | null>(null)
  const [location, setLocation] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [details, setDetails] = useState<any>(null)

  const fetchAQI = async (lat: number, lon: number) => {
    try {
      setLoading(true)
      setError("")

      // ⭐ CRITICAL FIX: Calling the internal Next.js API route
      // This route (app/api/aqi/route.ts) has the OpenWeatherMap logic with the API key.
      const response = await fetch(`/api/aqi?lat=${lat}&lon=${lon}`)

      if (!response.ok) {
        // If the internal route returns a 400 or 500, throw an error
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch AQI data from API route");
      }

      const data = await response.json()
      
      // Extract AQI (1-5 scale) and components from the local API response
      const aqiValue = data.aqi
      const pollutants = data.components

      if (aqiValue === undefined) {
          throw new Error("Invalid AQI data received (AQI value missing).");
      }

      setAQI(aqiValue)
      onAQIUpdate(aqiValue)
      setDetails(pollutants)

      // Get location name from coordinates (Nominatim)
      const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
      const geoData = await geoResponse.json()
      const locationName = geoData.address?.city || geoData.address?.town || "Your Location"

      setLocation(locationName)
      onLocationUpdate(locationName)
    } catch (err: any) {
      setError(err.message || "Unable to fetch AQI data. Please try again.")
      console.error("Frontend Fetch Error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Function to handle geolocation success/failure
    const handleGeolocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              fetchAQI(position.coords.latitude, position.coords.longitude)
            },
            () => {
              // Default to Delhi if geolocation fails
              fetchAQI(28.7041, 77.1025)
              setLocation("Delhi (Default)")
            },
          )
        } else {
            // Geolocation is not supported by the browser
            setError("Geolocation is not supported. Defaulting to Delhi.");
            fetchAQI(28.7041, 77.1025)
            setLocation("Delhi (Default)")
        }
    };
    handleGeolocation();
  }, [])
  
  // Helper to convert OpenWeatherMap pollutant keys to display names and units
  const getPollutantDisplay = (key: string, value: number) => {
      // OWM returns components in µg/m³ for display here
      const displayMap: { [key: string]: { name: string, unit: string } } = {
          'pm2_5': { name: 'PM2.5', unit: 'µg/m³' },
          'pm10': { name: 'PM10', unit: 'µg/m³' },
          'o3': { name: 'O₃', unit: 'µg/m³' }, 
          'no2': { name: 'NO₂', unit: 'µg/m³' },
          'so2': { name: 'SO₂', unit: 'µg/m³' },
          'co': { name: 'CO', unit: 'µg/m³' },
      };
      const info = displayMap[key.toLowerCase()] || { name: key, unit: '' };

      return {
          name: info.name,
          value: value ? value.toFixed(1) : "N/A",
          unit: info.unit
      };
  };

  const pollutantKeys = ['pm2_5', 'pm10', 'o3', 'no2']; // Keys to display

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Current Location AQI</CardTitle>
              <CardDescription>{location || "Detecting location..."}</CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  fetchAQI(position.coords.latitude, position.coords.longitude)
                })
              }
            }}
          >
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            <p className="font-semibold mb-2">Error Fetching Data</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : aqi !== null ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <AQIBadge aqi={aqi} size="large" /> 
            </div>

            <div className="grid grid-cols-2 gap-4">
                {pollutantKeys.map(key => {
                    const pollutantValue = details?.[key.toLowerCase()];
                    const display = getPollutantDisplay(key, pollutantValue || 0);
                    return (
                        <div key={key} className="bg-secondary p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">{display.name}</p>
                            <p className="text-2xl font-bold text-foreground">
                                {display.value} {display.unit}
                            </p>
                        </div>
                    );
                })}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}