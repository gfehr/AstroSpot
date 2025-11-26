import { WeatherForecast, WeatherDataPoint } from "../types";

// Open-Meteo is a free API that doesn't require a key for basic usage.
// It is perfect for this use case as "open source" weather data.
export const fetchWeatherForecast = async (lat: number, lng: number, spotId: string): Promise<WeatherForecast> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,cloud_cover,visibility,relative_humidity_2m,precipitation_probability&forecast_days=3`
    );

    if (!response.ok) {
      throw new Error("Weather service unavailable");
    }

    const data = await response.json();
    
    // Transform Open-Meteo structure to our app structure
    const hourly = data.hourly;
    const points: WeatherDataPoint[] = [];

    // Take every 3rd hour to keep the chart clean, or just the first 24-48 hours
    for (let i = 0; i < hourly.time.length; i += 2) {
        points.push({
            time: new Date(hourly.time[i]).toLocaleTimeString([], { hour: '2-digit', weekday: 'short' }),
            temperature: hourly.temperature_2m[i],
            cloudCover: hourly.cloud_cover[i],
            visibility: hourly.visibility[i],
            humidity: hourly.relative_humidity_2m[i],
            precipitationProb: hourly.precipitation_probability[i] || 0
        });
        
        // Limit to next 24-36 hours of data points for the UI
        if (points.length >= 16) break;
    }

    return {
      spotId,
      hourly: points
    };

  } catch (error) {
    console.error("Weather API Error:", error);
    throw new Error("Failed to fetch weather data.");
  }
};