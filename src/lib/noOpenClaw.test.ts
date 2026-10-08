import { describe, expect, it } from 'vitest';

// Raw text of every source file under src/ (this test file excluded, since it names the domain).
const sources = import.meta.glob<string>(['/src/**/*.{ts,tsx,js,jsx,css,html}', '!/src/lib/noOpenClaw.test.ts'], {
    query: '?raw',
    import: 'default',
    eager: true,
});

describe('no openclaw.ai references', () => {
    it('scans the app source', () => {
        expect(Object.keys(sources)).toContain('/src/pages/Ideas.tsx');
    });

    it('never sends data to openclaw.ai', () => {
        const offenders = Object.keys(sources).filter((path) => /openclaw\.ai/i.test(sources[path]));
        expect(offenders).toEqual([]);
    });
});
