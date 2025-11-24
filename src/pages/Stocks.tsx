import { TrendingUp, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { subscribeToStocks, addStock, deleteStock, type Stock } from '../lib/db';

export function Stocks() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newSymbol, setNewSymbol] = useState('');
    const [newName, setNewName] = useState('');
    const user = auth.currentUser;

    // Subscribe to stocks from Firestore
    useEffect(() => {
        if (!user) return;

        const unsubscribe = subscribeToStocks(user.uid, (updatedStocks) => {
            setStocks(updatedStocks);
        });

        return () => unsubscribe();
    }, [user]);

    const handleAddStock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newSymbol.trim() && newName.trim() && user) {
            try {
                await addStock(user.uid, newSymbol.toUpperCase().trim(), newName.trim());
                setNewSymbol('');
                setNewName('');
                setShowAddForm(false);
            } catch (error) {
                console.error('Error adding stock:', error);
            }
        }
    };

    const handleRemoveStock = async (id: string) => {
        try {
            await deleteStock(id);
        } catch (error) {
            console.error('Error removing stock:', error);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.02em'
                    }}>
                        Stocks
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Manage your followed stocks
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.875rem 1.5rem',
                        background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '1rem'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(56, 189, 248, 0.3)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <Plus size={20} />
                    Add Stock
                </button>
            </div>

            {/* Add Stock Form */}
            {showAddForm && (
                <div style={{
                    padding: '2rem',
                    background: 'rgba(20, 20, 20, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                        Add New Stock
                    </h2>
                    <form onSubmit={handleAddStock}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    Symbol
                                </label>
                                <input
                                    type="text"
                                    value={newSymbol}
                                    onChange={(e) => setNewSymbol(e.target.value)}
                                    placeholder="e.g., AAPL"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g., Apple Inc."
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="submit"
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Add Stock
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stocks List */}
            {stocks.length === 0 ? (
                <div style={{
                    padding: '4rem 2rem',
                    background: 'rgba(20, 20, 20, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    textAlign: 'center'
                }}>
                    <TrendingUp size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-secondary)' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        No stocks yet
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Add your first stock to start tracking
                    </p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {stocks.map((stock) => (
                        <div
                            key={stock.id}
                            style={{
                                padding: '1.5rem',
                                background: 'rgba(20, 20, 20, 0.6)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '16px',
                                position: 'relative',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <button
                                onClick={() => handleRemoveStock(stock.id)}
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    borderRadius: '8px',
                                    padding: '0.5rem',
                                    cursor: 'pointer',
                                    color: '#fca5a5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                }}
                            >
                                <X size={16} />
                            </button>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1rem'
                            }}>
                                <TrendingUp size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                                {stock.symbol}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                {stock.name}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
