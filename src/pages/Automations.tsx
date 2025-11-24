import { Plus, Play, Pause, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { subscribeToAutomations, updateAutomation, deleteAutomation, type Automation } from '../lib/db';

export function Automations() {
    const [automations, setAutomations] = useState<Automation[]>([]);
    const [loading, setLoading] = useState(true);
    const user = auth.currentUser;

    useEffect(() => {
        if (!user) return;

        // Subscribe to real-time updates
        const unsubscribe = subscribeToAutomations(user.uid, (updatedAutomations) => {
            setAutomations(updatedAutomations);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const toggleStatus = async (automation: Automation) => {
        try {
            await updateAutomation(automation.id, {
                status: automation.status === 'active' ? 'paused' : 'active'
            });
        } catch (error) {
            console.error('Error updating automation:', error);
        }
    };

    const handleDeleteAutomation = async (id: string) => {
        try {
            await deleteAutomation(id);
        } catch (error) {
            console.error('Error deleting automation:', error);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    letterSpacing: '-0.02em'
                }}>
                    Automations
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Manage your automated workflows
                </p>
            </div>

            {/* Create Button */}
            <div style={{ marginBottom: '2rem' }}>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.875rem 1.5rem',
                    background: 'linear-gradient(to right, #a855f7, #ec4899)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Plus size={18} />
                    Create Automation
                </button>
            </div>

            {/* Automations List */}
            <div style={{
                display: 'grid',
                gap: '1rem'
            }}>
                {automations.map((automation) => (
                    <div
                        key={automation.id}
                        style={{
                            padding: '1.5rem',
                            background: 'rgba(20, 20, 20, 0.6)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '16px',
                            transition: 'transform 0.2s, border-color 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.borderColor = automation.status === 'active'
                                ? 'rgba(168, 85, 247, 0.3)'
                                : 'rgba(255, 255, 255, 0.15)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '0.75rem'
                        }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                                {automation.name}
                            </h3>
                            <span style={{
                                padding: '0.375rem 0.875rem',
                                background: automation.status === 'active'
                                    ? 'rgba(34, 197, 94, 0.2)'
                                    : 'rgba(156, 163, 175, 0.2)',
                                color: automation.status === 'active' ? '#86efac' : '#d1d5db',
                                borderRadius: '9999px',
                                fontSize: '0.875rem',
                                fontWeight: 600
                            }}>
                                {automation.status === 'active' ? 'Active' : 'Paused'}
                            </span>
                        </div>

                        <p style={{
                            color: 'var(--text-secondary)',
                            marginBottom: '1.5rem',
                            fontSize: '0.95rem'
                        }}>
                            {automation.description}
                        </p>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => toggleStatus(automation)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.625rem 1rem',
                                    background: automation.status === 'active'
                                        ? 'rgba(251, 191, 36, 0.1)'
                                        : 'rgba(34, 197, 94, 0.1)',
                                    border: automation.status === 'active'
                                        ? '1px solid rgba(251, 191, 36, 0.3)'
                                        : '1px solid rgba(34, 197, 94, 0.3)',
                                    borderRadius: '8px',
                                    color: automation.status === 'active' ? '#fcd34d' : '#86efac',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = automation.status === 'active'
                                        ? 'rgba(251, 191, 36, 0.2)'
                                        : 'rgba(34, 197, 94, 0.2)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = automation.status === 'active'
                                        ? 'rgba(251, 191, 36, 0.1)'
                                        : 'rgba(34, 197, 94, 0.1)';
                                }}
                            >
                                {automation.status === 'active' ? (
                                    <>
                                        <Pause size={16} />
                                        Pause
                                    </>
                                ) : (
                                    <>
                                        <Play size={16} />
                                        Resume
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => handleDeleteAutomation(automation.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.625rem 1rem',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    borderRadius: '8px',
                                    color: '#fca5a5',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                }}
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
