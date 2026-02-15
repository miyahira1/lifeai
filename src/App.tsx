import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Automations } from './pages/Automations';
import { Stocks } from './pages/Stocks';
import { HelloIdeas } from './pages/Ideas';
import { DashboardLayout } from './components/DashboardLayout';
import { Footer } from './components/Footer';

function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    );
  }

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
          <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.05em', textDecoration: 'none', color: 'white' }}>
            Life<span className="text-gradient">AI</span>
          </Link>
          <div className="flex items-center" style={{ gap: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>

            {user ? (
              <div className="flex items-center" style={{ gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '2px solid rgba(255, 255, 255, 0.2)'
                      }}
                    />
                  )}
                  <span style={{ color: 'white', fontWeight: 500 }}>
                    {user.displayName || user.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  style={{
                    padding: '0.5rem 1.25rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '9999px',
                    color: '#fca5a5',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/login" style={{
                padding: '0.5rem 1.25rem',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '9999px',
                color: 'white',
                fontWeight: 500,
                transition: 'background 0.2s'
              }} className="hover:bg-white/20">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {children}

      <Footer />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          user ? <Navigate to="/dashboard" /> : (
            <Layout>
              <Landing />
            </Layout>
          )
        } />
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" /> : <Login />
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/tasks" element={
          <ProtectedRoute>
            <Layout>
              <DashboardLayout>
                <Tasks />
              </DashboardLayout>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/automations" element={
          <ProtectedRoute>
            <Layout>
              <DashboardLayout>
                <Automations />
              </DashboardLayout>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/stocks" element={
          <ProtectedRoute>
            <Layout>
              <DashboardLayout>
                <Stocks />
              </DashboardLayout>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/ideas" element={
          <ProtectedRoute>
            <Layout>
              <DashboardLayout>
                <HelloIdeas />
              </DashboardLayout>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
