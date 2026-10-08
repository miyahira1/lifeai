import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchWeather, parseWeather, weatherLabel } from './weather';

// Trimmed real Open-Meteo response for Buenos Aires.
const sample = {
    current: { time: '2026-10-08T11:30', temperature_2m: 17.6, weather_code: 3 },
    daily: { time: ['2026-10-08'], temperature_2m_max: [18.4], temperature_2m_min: [12.9] },
};

describe('weatherLabel', () => {
    it.each([
        [0, 'Clear'],
        [2, 'Partly cloudy'],
        [3, 'Overcast'],
        [45, 'Fog'],
        [53, 'Drizzle'],
        [63, 'Rain'],
        [81, 'Rain'],
        [73, 'Snow'],
        [95, 'Thunderstorm'],
        [42, 'Unknown'],
    ])('maps WMO code %i to %s', (code, label) => {
        expect(weatherLabel(code)).toBe(label);
    });
});

describe('parseWeather', () => {
    it('extracts temperature, condition and today\'s high/low', () => {
        expect(parseWeather(sample)).toEqual({ temperature: 17.6, condition: 'Overcast', high: 18.4, low: 12.9 });
    });
});

describe('fetchWeather', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('requests Buenos Aires from Open-Meteo', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => sample });
        vi.stubGlobal('fetch', fetchMock);
        await expect(fetchWeather()).resolves.toMatchObject({ temperature: 17.6 });
        const url = new URL(fetchMock.mock.calls[0][0]);
        expect(url.origin).toBe('https://api.open-meteo.com');
        expect(url.searchParams.get('latitude')).toBe('-34.61');
        expect(url.searchParams.get('longitude')).toBe('-58.38');
        expect(url.searchParams.get('timezone')).toBe('America/Argentina/Buenos_Aires');
    });

    it('rejects on an HTTP error so the dashboard can show its error state', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
        await expect(fetchWeather()).rejects.toThrow('503');
    });
});
