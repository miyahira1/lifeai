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
            </div>
        </footer>
    );
};
