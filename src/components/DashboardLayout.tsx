import React from 'react';
import { CheckSquare, Zap, Home, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', icon: Home, label: 'Dashboard' },
        { path: '/dashboard/tasks', icon: CheckSquare, label: 'Tasks' },
        { path: '/dashboard/automations', icon: Zap, label: 'Automations' },
        { path: '/dashboard/stocks', icon: TrendingUp, label: 'Stocks' },
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

            {/* Main Content */}
            <main className="dashboard-main">
                {children}
            </main>
        </div>
    );
}
