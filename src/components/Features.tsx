import React from 'react';
import { Zap, Shield, Globe } from 'lucide-react';

const features = [
    {
        icon: <Zap size={32} />,
        title: 'Lightning Fast',
        description: 'Optimized for speed with edge computing capabilities that deliver instant results.'
    },
    {
        icon: <Shield size={32} />,
        title: 'Bank-Grade Security',
        description: 'Your data is encrypted end-to-end with enterprise-level security protocols.'
    },
    {
        icon: <Globe size={32} />,
        title: 'Global Scale',
        description: 'Deployed across 190+ countries with low-latency access from anywhere.'
    }
];

export const Features: React.FC = () => {
    return (
        <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
            <div className="container">
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                    {features.map((feature, index) => (
                        <div key={index} style={{
                            padding: '2rem',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '1rem',
                            border: '1px solid var(--border-color)',
                            transition: 'transform 0.2s ease',
                            cursor: 'default'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{
                                color: 'var(--accent-primary)',
                                marginBottom: '1.5rem',
                                background: 'rgba(59, 130, 246, 0.1)',
                                width: 'fit-content',
                                padding: '1rem',
                                borderRadius: '1rem'
                            }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
