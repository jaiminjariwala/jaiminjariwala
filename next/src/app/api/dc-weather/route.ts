import { NextResponse } from "next/server";
import type { WeatherObservation } from "@/types/api";

interface NwsObservation {
  properties?: {
    temperature?: { value: number | null; unitCode: string };
    windSpeed?: { value: number | null; unitCode: string };
    timestamp?: string;
    textDescription?: string;
  };
}

export async function GET() {
  try {
    // Public-domain NWS observations from Reagan National, near Washington DC.
    const response = await fetch("https://api.weather.gov/stations/KDCA/observations/latest", {
      headers: { "User-Agent": "JaiminPortfolio (https://jaiminjariwala.netlify.app)", Accept: "application/geo+json" },
      next: { revalidate: 600 }, signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Weather provider unavailable");
    const { properties } = await response.json() as NwsObservation;
    const temperature = properties?.temperature?.value;
    const wind = properties?.windSpeed?.value;
    if (typeof temperature !== "number" || typeof wind !== "number" || ![temperature, wind].every(Number.isFinite) || properties?.temperature?.unitCode !== "wmoUnit:degC" || properties.windSpeed?.unitCode !== "wmoUnit:km_h-1" || typeof properties.timestamp !== "string" || typeof properties.textDescription !== "string") throw new Error("Invalid weather data");
    const timestamp = Date.parse(properties.timestamp);
    if (!Number.isFinite(timestamp) || Date.now() - timestamp > 3 * 60 * 60 * 1000) throw new Error("Weather observation is stale");
    return NextResponse.json<WeatherObservation>({ temperature: temperature * 9 / 5 + 32, wind: wind / 1.609344, description: properties.textDescription, time: properties.timestamp, source: "NOAA/NWS KDCA" });
  } catch {
    return NextResponse.json({ error: "Weather temporarily unavailable" }, { status: 503 });
  }
}
