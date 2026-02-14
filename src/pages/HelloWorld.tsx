import { Hand } from 'lucide-react';

export function HelloWorld() {
    return (
        <div style={{ padding: '2rem 0' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    marginBottom: '0.5rem'
                }}>
                    Hello World <Hand size={28} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Welcome to LifeAI!
                </p>
            </div>

            <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <div style={{
                    fontSize: '4rem',
                    marginBottom: '1rem'
                }}>
                    🦀
                </div>
                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Built by Tenazas
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    This page was added by your AI assistant.
                </p>
            </div>
        </div>
    );
}
