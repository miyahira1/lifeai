import React, { useState } from 'react';
import { Lightbulb, Plus, X } from 'lucide-react';

interface Idea {
    id: string;
    title: string;
    description: string;
    status: 'new' | 'mockup' | 'contacted' | 'sold';
    createdAt: number;
}

export function HelloIdeas() {
    const [ideas, setIdeas] = useState<Idea[]>([
        {
            id: '1',
            title: 'Google Maps Website Scanner & Upgrader',
            description: 'Scan websites listed in Google Maps for outdated designs. Generate a modern mockup using AI, then contact the owner offering the upgrade with the pre-generated mockup as proof of value.',
            status: 'new',
            createdAt: Date.now()
        }
    ]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');

    const handleAddIdea = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        const newIdea: Idea = {
            id: Date.now().toString(),
            title: newTitle,
            description: newDescription,
            status: 'new',
            createdAt: Date.now()
        };

        setIdeas([newIdea, ...ideas]);
        setNewTitle('');
        setNewDescription('');
        setShowAddModal(false);
    };

    return (
        <div style={{ padding: '2rem 0' }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '2rem'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        marginBottom: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        Hello Ideas <Lightbulb size={28} style={{ color: '#fbbf24' }} />
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Potential projects and experiments.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.25rem',
                        background: 'white',
                        color: 'black',
                        border: 'none',
                        borderRadius: '9999px',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'opacity 0.2s'
                    }}
                    className="hover:opacity-90"
                >
                    <Plus size={18} />
                    Add Idea
                </button>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {ideas.map(idea => (
                    <div key={idea.id} style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.4 }}>{idea.title}</h3>
                            <span style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '9999px',
                                background: 'rgba(56, 189, 248, 0.1)',
                                color: '#38bdf8',
                                fontWeight: 500,
                                textTransform: 'capitalize'
                            }}>
                                {idea.status}
                            </span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                            {idea.description}
                        </p>
                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Added {new Date(idea.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Idea Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    padding: '1rem'
                }} onClick={(e) => {
                    if (e.target === e.currentTarget) setShowAddModal(false);
                }}>
                    <div style={{
                        background: '#1a1a1a',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: '2rem',
                        width: '100%',
                        maxWidth: '500px',
                        position: 'relative'
                    }}>
                        <button 
                            onClick={() => setShowAddModal(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={20} />
                        </button>
                        
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Add New Idea</h2>
                        
                        <form onSubmit={handleAddIdea} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="e.g., AI Plant Monitor"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                    autoFocus
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    Description
                                </label>
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    placeholder="Describe the idea..."
                                    rows={4}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newTitle.trim()}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        background: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'black',
                                        fontWeight: 600,
                                        cursor: newTitle.trim() ? 'pointer' : 'not-allowed',
                                        opacity: newTitle.trim() ? 1 : 0.5
                                    }}
                                >
                                    Add Idea
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
