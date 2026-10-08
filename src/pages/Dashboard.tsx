import { Cloud, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchWeather, type Weather } from '../lib/weather';

export function Dashboard() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [weather, setWeather] = useState<Weather | null>(null);
    const [weatherError, setWeatherError] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchWeather()
            .then(setWeather)
            .catch((error) => {
                console.error('Error loading weather:', error);
                setWeatherError(true);
            });
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div>
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    letterSpacing: '-0.02em'
                }}>
                    Welcome Back
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Here's what's happening today!
                </p>
            </div>

            {/* Info Cards Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {/* Date & Time Card */}
                <div style={{
                    padding: '2rem',
                    background: 'rgba(20, 20, 20, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Clock size={20} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Current Time</h3>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        {formatTime(currentTime)}
                    </p>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {formatDate(currentTime)}
                    </p>
                </div>

                {/* Weather Card */}
                <div style={{
                    padding: '2rem',
                    background: 'rgba(20, 20, 20, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Cloud size={20} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Weather</h3>
                    </div>
                    {weather ? (
                        <>
                            <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                {Math.round(weather.temperature)}°C
                            </p>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                {weather.condition} · H {Math.round(weather.high)}° L {Math.round(weather.low)}° · Buenos Aires
                            </p>
                        </>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {weatherError ? 'Weather unavailable right now.' : 'Loading weather...'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
