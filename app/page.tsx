"use client"

import { useState } from "react"
import CurrentLocationAQI from "@/components/current-location-aqi"
import MajorCitiesAQI from "@/components/major-cities-aqi"
import SafetyTips from "@/components/safety-tips"
import Header from "@/components/header"

export default function Home() {
  const [currentAQI, setCurrentAQI] = useState<number | null>(null)
  const [location, setLocation] = useState<string>("")

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Location AQI */}
          <div className="lg:col-span-2">
            <CurrentLocationAQI onAQIUpdate={setCurrentAQI} onLocationUpdate={setLocation} />
          </div>

          {/* Safety Tips */}
          <div>
            <SafetyTips aqi={currentAQI} />
          </div>
        </div>

        {/* Major Cities AQI */}
        <div className="mt-8">
          <MajorCitiesAQI />
        </div>
      </div>
    </main>
  )
}
