'use client'

import { useEffect, useState } from 'react'

interface AQIData {
  city: string
  aqi: number
  category: string
  advice: string
}

export default function Home() {
  const [data, setData] = useState<AQIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAQI = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords

            // ✅ Fetch from your own backend API route (no CORS)
            const res = await fetch(`/api/aqi?lat=${latitude}&lon=${longitude}`)
            if (!res.ok) throw new Error('API error')

            const json = await res.json()

            if (json.results && json.results.length > 0) {
              const city = json.results[0].city || 'Unknown'
              const value = json.results[0].value
              const { category, advice } = getAQICategory(value)
              setData({ city, aqi: value, category, advice })
            } else {
              setError('No AQI data found near you')
            }
          })
        } else {
          setError('Geolocation not supported in this browser')
        }
      } catch (err) {
        console.error(err)
        // ✅ Fallback to Delhi if live data fails
        const fallbackAQI = 180
        const { category, advice } = getAQICategory(fallbackAQI)
        setData({ city: 'Delhi', aqi: fallbackAQI, category, advice })
        setError('Using fallback data (Delhi)')
      } finally {
        setLoading(false)
      }
    }

    fetchAQI()
  }, [])

  const getAQICategory = (value: number) => {
    if (value <= 50)
      return { category: 'Good', advice: 'Air quality is good — enjoy outdoor activities!' }
    if (value <= 100)
      return { category: 'Moderate', advice: 'Air quality is acceptable — sensitive people should be cautious.' }
    if (value <= 150)
      return { category: 'Unhealthy for Sensitive Groups', advice: 'Limit outdoor exertion if you have respiratory issues.' }
    if (value <= 200)
      return { category: 'Unhealthy', advice: 'Avoid prolonged outdoor activities.' }
    if (value <= 300)
      return { category: 'Very Unhealthy', advice: 'Stay indoors and use air purifiers if possible.' }
    return { category: 'Hazardous', advice: 'Health alert! Avoid outdoor exposure completely.' }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">🌍 Real-Time AQI Monitor</h1>

      {loading && <p>Fetching air quality data...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {data && (
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-semibold mb-2">{data.city}</h2>
          <p className="text-5xl font-bold mb-3">{Math.round(data.aqi)}</p>
          <p className="text-lg mb-2">Category: <span className="font-semibold">{data.category}</span></p>
          <p className="text-sm text-gray-300">{data.advice}</p>
        </div>
      )}
    </main>
  )
}
