import React from 'react';
import { Button } from './Button';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
    return (
        <section className="section-padding" style={{
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Glow */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
                zIndex: -1,
                pointerEvents: 'none'
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '9999px',
                        marginBottom: '2rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <Sparkles size={16} className="text-gradient" />
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Introducing LifeAI 1.0</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(3rem, 8vw, 5rem)',
                        lineHeight: 1.1,
                        marginBottom: '1.5rem',
                        letterSpacing: '-0.03em'
                    }}>
                        Experience the Future of <br />
                        <span className="text-gradient">Intelligent Living</span>
                    </h1>

                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '3rem',
                        maxWidth: '600px',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}>
                        Seamlessly integrate advanced AI into your daily workflow.
                        Elevate your productivity with our next-generation platform.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Get Started <ArrowRight size={18} />
                            </div>
                        </Button>
                        <Button variant="secondary">View Demo</Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
