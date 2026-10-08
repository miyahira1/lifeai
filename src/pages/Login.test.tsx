import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Login } from './Login';

// Keep the real Firebase SDK (and analytics) out of the test.
vi.mock('../lib/firebase', () => ({ auth: {}, googleProvider: {} }));

describe('signed-out screen', () => {
    const html = renderToStaticMarkup(<Login />);

    it('shows the LifeAI logo and a single Google sign-in button', () => {
        expect(html).toContain('Life<span class="text-gradient">AI</span>');
        expect(html.match(/<button/g)).toHaveLength(1);
        expect(html).toContain('Sign in with Google');
    });

    it('has no email/password form, links or other landing content', () => {
        expect(html).not.toMatch(/<form|<input|<a |<h1|Sign up|Back to Home/);
    });
});
