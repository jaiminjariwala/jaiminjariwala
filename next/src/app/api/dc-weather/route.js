import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=38.9072&longitude=-77.0369&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York", {
      next: { revalidate: 600 }, signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Weather provider unavailable");
    const { current } = await response.json();
    if (![current?.temperature_2m, current?.wind_speed_10m, current?.weather_code].every(Number.isFinite)) throw new Error("Invalid weather data");
    return NextResponse.json({ temperature: current.temperature_2m, wind: current.wind_speed_10m, code: current.weather_code, time: current.time });
  } catch {
    return NextResponse.json({ error: "Weather temporarily unavailable" }, { status: 503 });
  }
}
