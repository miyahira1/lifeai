import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Footer } from './components/Footer';

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '1.5rem 0',
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 50,
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div className="container flex justify-between items-center">
          <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.05em' }}>
            Life<span className="text-gradient">AI</span>
          </div>
          <div className="flex" style={{ gap: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <a href="#" style={{ transition: 'color 0.2s' }} className="hover:text-white">Product</a>
            <a href="#" style={{ transition: 'color 0.2s' }} className="hover:text-white">Solutions</a>
            <a href="#" style={{ transition: 'color 0.2s' }} className="hover:text-white">Pricing</a>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        <Features />
      </main>

      <Footer />
    </div>
  );
}

export default App;
