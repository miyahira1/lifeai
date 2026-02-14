import { Cloud, Calendar, Clock, CheckSquare, Zap, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { subscribeToStocks, type Stock } from '../lib/db';

export function Dashboard() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [stocks, setStocks] = useState<Stock[]>([]);
    const user = auth.currentUser;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Subscribe to stocks from Firestore
    useEffect(() => {
        if (!user) return;

        const unsubscribe = subscribeToStocks(user.uid, (updatedStocks) => {
            setStocks(updatedStocks);
        });

        return () => unsubscribe();
    }, [user]);

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
                    <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        22°C
                    </p>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Partly Cloudy
                    </p>
                </div>

                {/* Calendar Card */}
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
                            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Calendar size={20} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Today's Events</h3>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        3
                    </p>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Upcoming meetings
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{
                padding: '2rem',
                background: 'rgba(20, 20, 20, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px'
            }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    Quick Actions
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <Link
                        to="/dashboard/tasks"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1.25rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            color: 'white',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <CheckSquare size={20} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600 }}>Tasks</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Manage your to-dos</div>
                        </div>
                    </Link>

                    <Link
                        to="/dashboard/automations"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1.25rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            color: 'white',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Zap size={20} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600 }}>Automations</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Manage workflows</div>
                        </div>
                    </Link>

                    <Link
                        to="/dashboard/stocks"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1.25rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            color: 'white',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600 }}>Stocks</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Track your portfolio</div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Followed Stocks */}
            {stocks.length > 0 && (
                <div style={{
                    marginTop: '2rem',
                    padding: '2rem',
                    background: 'rgba(20, 20, 20, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                            Followed Stocks
                        </h2>
                        <Link
                            to="/dashboard/stocks"
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            }}
                        >
                            Manage Stocks
                        </Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {stocks.map((stock) => (
                            <div
                                key={stock.id}
                                style={{
                                    padding: '1.25rem',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '12px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                }}
                            >
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '0.75rem'
                                }}>
                                    <TrendingUp size={18} />
                                </div>
                                <div style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                                    {stock.symbol}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    {stock.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
