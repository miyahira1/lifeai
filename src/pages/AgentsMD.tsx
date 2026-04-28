import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText } from 'lucide-react';

interface FileEntry {
    id: string;
    label: string;
    file: string;
}

export function AgentsMD() {
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/agents-files.json')
            .then(r => r.json())
            .then((data: FileEntry[]) => {
                setFiles(data);
                if (data.length > 0) setSelectedId(data[0].id);
            });
    }, []);

    useEffect(() => {
        if (!selectedId) return;
        const entry = files.find(f => f.id === selectedId);
        if (!entry) return;
        setLoading(true);
        fetch(entry.file)
            .then(r => r.text())
            .then(text => {
                setContent(text);
                setLoading(false);
            });
    }, [selectedId, files]);

    return (
        <div style={{ display: 'flex', gap: '1.5rem', height: '100%', padding: '1.5rem 0' }}>
            {/* Sidebar */}
            <div style={{
                width: '200px',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
            }}>
                {files.map(f => (
                    <button
                        key={f.id}
                        onClick={() => setSelectedId(f.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.65rem 1rem',
                            borderRadius: '8px',
                            border: selectedId === f.id
                                ? '1px solid rgba(56, 189, 248, 0.4)'
                                : '1px solid transparent',
                            background: selectedId === f.id
                                ? 'rgba(56, 189, 248, 0.1)'
                                : 'rgba(255,255,255,0.04)',
                            color: selectedId === f.id ? 'white' : 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            fontWeight: selectedId === f.id ? 600 : 400,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s'
                        }}
                    >
                        <FileText size={15} />
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div style={{
                flex: 1,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '2rem',
                overflowY: 'auto',
                color: 'var(--text-secondary)',
                lineHeight: 1.7
            }}>
                {loading ? (
                    <span style={{ color: 'var(--text-secondary)' }}>Loading...</span>
                ) : (
                    <div className="markdown-body">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}
