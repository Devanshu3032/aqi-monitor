import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  try {
    const res = await fetch(
      `https://api.openaq.org/v2/measurements?coordinates=${lat},${lon}&radius=10000&limit=1`
    )
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch AQI data' }, { status: 500 })
  }
}
