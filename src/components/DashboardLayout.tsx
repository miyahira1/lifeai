import React, { useState } from 'react';
import { CheckSquare, Zap, Home, TrendingUp, Bell, X, Clock, BellRing, Lightbulb } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTaskNotifications } from '../hooks/useTaskNotifications';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const { activeNotification, snoozeTask, dismissNotification, permission, requestPermission } = useTaskNotifications();
    const [snoozeDuration, setSnoozeDuration] = useState(10);

    const menuItems = [
        { path: '/dashboard', icon: Home, label: 'Dashboard' },
        { path: '/dashboard/tasks', icon: CheckSquare, label: 'Tasks' },
        { path: '/dashboard/automations', icon: Zap, label: 'Automations' },
        { path: '/dashboard/stocks', icon: TrendingUp, label: 'Stocks' },
        { path: '/dashboard/ideas', icon: Lightbulb, label: 'Ideas' },
    ];

    return (
        <div className="dashboard-container">
            {/* Top Navigation Bar */}
            <div className="dashboard-top-nav">
                <nav className="dashboard-nav-items">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '9999px',
                                    textDecoration: 'none',
                                    color: isActive ? 'white' : 'var(--text-secondary)',
                                    background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                                    border: isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                                    transition: 'all 0.2s',
                                    fontWeight: isActive ? 600 : 400,
                                    fontSize: '0.95rem'
                                }}
                                onMouseOver={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    }
                                }}
                                onMouseOut={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Notification Permission Banner */}
            {permission === 'default' && (
                <div style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
                    padding: '0.75rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <span style={{ color: '#38bdf8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BellRing size={16} />
                        Enable notifications to get task reminders
                    </span>
                    <button
                        onClick={requestPermission}
                        style={{
                            background: '#38bdf8',
                            color: 'white',
                            border: 'none',
                            padding: '0.4rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Enable
                    </button>
                </div>
            )}

            {/* Notification Modal */}
            {activeNotification && (
                <div style={{
                    position: 'fixed',
                    top: '6rem',
                    right: '1rem',
                    width: '350px',
                    background: 'rgba(20, 20, 20, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    zIndex: 100,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <div style={{
                                padding: '0.5rem',
                                borderRadius: '50%',
                                background: 'rgba(56, 189, 248, 0.2)',
                                color: '#38bdf8'
                            }}>
                                <Bell size={20} />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>Task Reminder</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>It's time!</p>
                            </div>
                        </div>
                        <button onClick={dismissNotification} style={{ color: 'var(--text-secondary)', padding: '0.25rem', cursor: 'pointer' }}>
                            <X size={18} />
                        </button>
                    </div>

                    <div style={{ marginBottom: '1.25rem', color: 'white', fontSize: '1.1rem', fontWeight: 500 }}>
                        {activeNotification.text}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                            value={snoozeDuration}
                            onChange={(e) => setSnoozeDuration(Number(e.target.value))}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                color: 'white',
                                padding: '0.6rem',
                                outline: 'none',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            <option value={10} style={{ background: '#222' }}>10m</option>
                            <option value={30} style={{ background: '#222' }}>30m</option>
                            <option value={60} style={{ background: '#222' }}>1h</option>
                            <option value={120} style={{ background: '#222' }}>2h</option>
                            <option value={240} style={{ background: '#222' }}>4h</option>
                            <option value={480} style={{ background: '#222' }}>8h</option>
                        </select>
                        <button
                            onClick={() => snoozeTask(activeNotification, snoozeDuration)}
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.6rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                        >
                            <Clock size={16} /> Snooze
                        </button>
                        <button
                            onClick={dismissNotification}
                            style={{
                                flex: 1,
                                padding: '0.6rem',
                                background: 'linear-gradient(to right, #38bdf8, #818cf8)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="dashboard-main">
                {children}
            </main>
        </div>
    );
}
