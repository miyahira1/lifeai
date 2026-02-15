import React, { useState, useEffect } from 'react';
import { Lightbulb, Plus, X, Sparkles, ChevronRight, Trash2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { subscribeToIdeas, addIdea, updateIdea, deleteIdea, type Idea } from '../lib/db';

export function HelloIdeas() {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    
    const user = auth.currentUser;

    useEffect(() => {
        if (!user) return;
        const unsubscribe = subscribeToIdeas(user.uid, (updatedIdeas) => {
            setIdeas(updatedIdeas);
        });
        return () => unsubscribe();
    }, [user]);

    const handleAddIdea = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !user) return;

        try {
            await addIdea(user.uid, newTitle, newDescription);
            setNewTitle('');
            setNewDescription('');
            setShowAddModal(false);
        } catch (error) {
            console.error('Error adding idea:', error);
        }
    };

    const handleDeleteIdea = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this idea?')) {
            try {
                await deleteIdea(id);
                if (selectedIdea?.id === id) setSelectedIdea(null);
            } catch (error) {
                console.error('Error deleting idea:', error);
            }
        }
    };

    const handleStatusChange = async (id: string, newStatus: Idea['status']) => {
        try {
            await updateIdea(id, { status: newStatus });
        } catch (error) {
            console.error('Error updating status:', error);
        }
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
                        Track and refine your potential projects.
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
                    <div 
                        key={idea.id} 
                        onClick={() => setSelectedIdea(idea)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, border-color 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.4 }}>{idea.title}</h3>
                            <button
                                onClick={(e) => handleDeleteIdea(e, idea.id)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    padding: '0.25rem'
                                }}
                                className="hover:text-red-400"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                            {idea.refinement && (
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.6rem',
                                    borderRadius: '9999px',
                                    background: 'rgba(168, 85, 247, 0.1)',
                                    color: '#c084fc',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}>
                                    <Sparkles size={12} /> Refined
                                </span>
                            )}
                        </div>

                        <p style={{ 
                            color: 'var(--text-secondary)', 
                            fontSize: '0.95rem', 
                            lineHeight: 1.6,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}>
                            {idea.description}
                        </p>
                        
                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                            <ChevronRight size={16} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Idea Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 100, padding: '1rem'
                }} onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
                    <div style={{
                        background: '#1a1a1a', border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '500px',
                        position: 'relative'
                    }}>
                        <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Add New Idea</h2>
                        <form onSubmit={handleAddIdea} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Title</label>
                                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., AI Plant Monitor" style={{ width: '100%', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem', outline: 'none' }} autoFocus />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Description</label>
                                <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Describe the idea..." rows={4} style={{ width: '100%', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem', outline: 'none', resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={!newTitle.trim()} style={{ flex: 1, padding: '0.75rem', background: 'white', border: 'none', borderRadius: '8px', color: 'black', fontWeight: 600, cursor: newTitle.trim() ? 'pointer' : 'not-allowed', opacity: newTitle.trim() ? 1 : 0.5 }}>Add Idea</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Idea Details Modal */}
            {selectedIdea && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 100, padding: '1rem'
                }} onClick={(e) => e.target === e.currentTarget && setSelectedIdea(null)}>
                    <div style={{
                        background: '#1a1a1a', border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '700px',
                        maxHeight: '90vh', overflowY: 'auto', position: 'relative',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <button onClick={() => setSelectedIdea(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                                {selectedIdea.title}
                            </h2>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {(['new', 'mockup', 'contacted', 'sold'] as const).map(status => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(selectedIdea.id, status)}
                                        style={{
                                            fontSize: '0.75rem',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            background: selectedIdea.status === status ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                            color: selectedIdea.status === status ? '#38bdf8' : 'var(--text-secondary)',
                                            border: selectedIdea.status === status ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                                            cursor: 'pointer',
                                            textTransform: 'capitalize',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', marginBottom: '0.75rem', fontWeight: 600 }}>Description</h3>
                            <p style={{ lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                                {selectedIdea.description}
                            </p>
                        </div>

                        <div style={{ 
                            background: 'rgba(168, 85, 247, 0.05)', 
                            border: '1px solid rgba(168, 85, 247, 0.2)', 
                            borderRadius: '12px', 
                            padding: '1.5rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Sparkles size={20} style={{ color: '#c084fc' }} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#c084fc' }}>AI Refinement</h3>
                            </div>
                            
                            {selectedIdea.refinement ? (
                                <div style={{ lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
                                    {selectedIdea.refinement}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)' }}>
                                    <p style={{ marginBottom: '1rem' }}>No AI refinement yet.</p>
                                    <button
                                        style={{
                                            padding: '0.6rem 1.25rem',
                                            background: 'rgba(168, 85, 247, 0.1)',
                                            border: '1px solid rgba(168, 85, 247, 0.3)',
                                            borderRadius: '8px',
                                            color: '#c084fc',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                        onClick={() => window.open(`https://openclaw.ai/refine?idea=${encodeURIComponent(selectedIdea.title)}`, '_blank')}
                                    >
                                        <Sparkles size={16} /> Refine with OpenClaw
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
