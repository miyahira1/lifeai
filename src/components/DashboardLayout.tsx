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
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <nav className="dashboard-nav">
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
                                    gap: '1rem',
                                    padding: '1rem 1.25rem',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    color: isActive ? 'white' : 'var(--text-secondary)',
                                    background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                                    border: isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                                    transition: 'all 0.2s',
                                    fontWeight: isActive ? 600 : 400
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
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {children}
            </main>
        </div>
    );
}
