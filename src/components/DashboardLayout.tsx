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
        <div style={{
            minHeight: '100vh',
            paddingTop: '5rem',
            display: 'flex'
        }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                position: 'fixed',
                left: 0,
                top: '5rem',
                bottom: 0,
                background: 'rgba(10, 10, 10, 0.6)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '2rem 1rem'
            }}>
                <nav>
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
                                    marginBottom: '0.5rem',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    color: isActive ? 'white' : 'var(--text-secondary)',
                                    background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                                    border: isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                                    transition: 'all 0.2s',
                                    fontWeight: isActive ? 600 : 400
                                }}
                                onMouseOver={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    }
                                }}
                                onMouseOut={(e) => {
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
            <main style={{
                marginLeft: '280px',
                flex: 1,
                padding: '2rem',
                minHeight: 'calc(100vh - 5rem)'
            }}>
                {children}
            </main>
        </div>
    );
}
