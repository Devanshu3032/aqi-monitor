"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AQIBadge from "./aqi-badge"
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

      // Using Open-Meteo API for AQI data (free, no API key required)
      const response = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air_quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,o3,no2,so2&timezone=auto`,
      )

      if (!response.ok) throw new Error("Failed to fetch AQI data")

      const data = await response.json()
      const aqiValue = Math.round(data.current.us_aqi)

      setAQI(aqiValue)
      onAQIUpdate(aqiValue)
      setDetails(data.current)

      // Get location name from coordinates
      const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
      const geoData = await geoResponse.json()
      const locationName = geoData.address?.city || geoData.address?.town || "Your Location"

      setLocation(locationName)
      onLocationUpdate(locationName)
    } catch (err) {
      setError("Unable to fetch AQI data. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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
    }
  }, [])

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
            <p>{error}</p>
          </div>
        ) : aqi !== null ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <AQIBadge aqi={aqi} size="large" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">PM2.5</p>
                <p className="text-2xl font-bold text-foreground">{details?.pm2_5?.toFixed(1) || "N/A"} µg/m³</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">PM10</p>
                <p className="text-2xl font-bold text-foreground">{details?.pm10?.toFixed(1) || "N/A"} µg/m³</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">O₃</p>
                <p className="text-2xl font-bold text-foreground">{details?.o3?.toFixed(1) || "N/A"} ppb</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">NO₂</p>
                <p className="text-2xl font-bold text-foreground">{details?.no2?.toFixed(1) || "N/A"} ppb</p>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
