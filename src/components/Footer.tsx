import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer style={{
            padding: '4rem 0',
            borderTop: '1px solid var(--border-color)',
            marginTop: 'auto'
        }}>
            <div className="container text-center">
                <p style={{ color: 'var(--text-secondary)' }}>
                    © {new Date().getFullYear()} LifeAI. All rights reserved.
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Last modified: Feb 14, 2026 18:11 • <a href="https://github.com/miyahira1/lifeai/commits/main" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>History</a>
                </p>
            </div>
        </footer>
    );
};
