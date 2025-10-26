// app/api/aqi/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  // 1. Retrieve the API Key from the environment
  const OWM_KEY = process.env.OPENWEATHER_API_KEY;

  if (!OWM_KEY) {
      // 🚨 Error: Key not loaded (Did you restart the server?)
      console.error("OpenWeatherMap API Key is missing. Check .env.local.");
      return NextResponse.json({ error: 'Server configuration error: API Key missing.' }, { status: 500 });
  }

  if (!lat || !lon) {
      // 🚨 Error: Geolocation data missing from frontend
      return NextResponse.json({ error: 'Latitude and Longitude parameters are missing from the request.' }, { status: 400 });
  }

  // 2. Construct the OpenWeatherMap Air Pollution API URL
  // Authentication is done via the 'appid' query parameter.
  const OWM_API_URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OWM_KEY}`;

  try {
    const res = await fetch(OWM_API_URL);

    // Check for network or authentication errors from OpenWeatherMap
    if (!res.ok) {
      const errorText = await res.text();
      console.error('OpenWeatherMap Request Failed:', res.status, errorText);
      
      let errorMessage = `API request failed with status: ${res.status}.`;
      if (res.status === 401) {
          errorMessage = "Authentication failed. Check your OpenWeatherMap API Key for validity.";
      }
      return NextResponse.json(
        { error: errorMessage }, 
        { status: res.status }
      );
    }

    const data = await res.json();

    // 3. Extract the Air Quality Index (AQI) value
    // OpenWeatherMap AQI is found deep within the JSON structure: data.list[0].main.aqi
    const aqiValue = data.list?.[0]?.main?.aqi; 

    if (aqiValue === undefined) {
      // 🚨 Error: Successful API call but missing expected data
      return NextResponse.json({ error: 'AQI value not found in OpenWeatherMap response.' }, { status: 500 });
    }

    // 4. Return the data to your frontend
    // OpenWeatherMap AQI uses a scale of 1 (Good) to 5 (Very Poor).
    return NextResponse.json({
        aqi: aqiValue,
        // You can return the full components data too, if needed by the frontend
        components: data.list[0].components
    });

  } catch (error) {
    console.error('API Route Execution Error:', error);
    return NextResponse.json({ error: 'An unexpected server error occurred during data fetch.' }, { status: 500 });
  }
}