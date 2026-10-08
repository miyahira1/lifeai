import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';

describe('dashboard nav', () => {
    it('has exactly two tabs: Dashboard and Ideas', () => {
        const html = renderToStaticMarkup(
            <MemoryRouter initialEntries={['/dashboard']}>
                <DashboardLayout>content</DashboardLayout>
            </MemoryRouter>
        );
        const links = [...html.matchAll(/<a [^>]*href="([^"]+)"[^>]*>.*?<\/svg>([^<]+)<\/a>/g)].map(([, href, label]) => [href, label]);
        expect(links).toEqual([
            ['/dashboard', 'Dashboard'],
            ['/dashboard/ideas', 'Ideas'],
        ]);
        expect(html).toContain('content');
    });
});
