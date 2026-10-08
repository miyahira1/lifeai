// Current weather for Buenos Aires from Open-Meteo (free, no API key).
export const WEATHER_URL =
    'https://api.open-meteo.com/v1/forecast?latitude=-34.61&longitude=-58.38' +
    '&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min' +
    '&timezone=America%2FArgentina%2FBuenos_Aires&forecast_days=1';

export interface Weather {
    temperature: number;
    condition: string;
    high: number;
    low: number;
}

// Short label for a WMO weather code (https://open-meteo.com/en/docs).
export function weatherLabel(code: number): string {
    if (code === 0) return 'Clear';
    if (code <= 2) return 'Partly cloudy';
    if (code === 3) return 'Overcast';
    if (code === 45 || code === 48) return 'Fog';
    if (code >= 51 && code <= 57) return 'Drizzle';
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'Rain';
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'Snow';
    if (code >= 95 && code <= 99) return 'Thunderstorm';
    return 'Unknown';
}

interface OpenMeteoResponse {
    current: { temperature_2m: number; weather_code: number };
    daily: { temperature_2m_max: number[]; temperature_2m_min: number[] };
}

export function parseWeather(data: OpenMeteoResponse): Weather {
    return {
        temperature: data.current.temperature_2m,
        condition: weatherLabel(data.current.weather_code),
        high: data.daily.temperature_2m_max[0],
        low: data.daily.temperature_2m_min[0],
    };
}

export async function fetchWeather(): Promise<Weather> {
    const res = await fetch(WEATHER_URL);
    if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);
    return parseWeather(await res.json());
}
