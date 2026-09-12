'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Compass, BookOpen, LayoutDashboard, Shield, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface UserSession {
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session via NextAuth session endpoint
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleSignOut = async () => {
    router.push('/api/auth/signout');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link href="/" className="nav-brand">
          <div className="brand-icon">
            <Compass size={20} color="#ffffff" />
          </div>
          <span>Roadmap<span className="brand-badge">Engine</span></span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link
              href="/tracks"
              className={`nav-link ${pathname.startsWith('/tracks') ? 'active' : ''}`}
            >
              <BookOpen size={16} />
              <span>Explore Tracks</span>
            </Link>
          </li>

          {user && (
            <li>
              <Link
                href="/dashboard"
                className={`nav-link ${pathname.startsWith('/dashboard') ? 'active' : ''}`}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
            </li>
          )}

          {user?.role === 'admin' && (
            <li>
              <Link
                href="/admin"
                className={`nav-link ${pathname.startsWith('/admin') ? 'active' : ''}`}
                style={{ color: '#f59e0b' }}
              >
                <Shield size={16} />
                <span>Admin Studio</span>
              </Link>
            </li>
          )}

          {!loading && (
            <li>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-primary)',
                      fontSize: '0.85rem',
                    }}
                  >
                    <UserIcon size={14} color="#38bdf8" />
                    <span>{user.name || user.email?.split('@')[0]}</span>
                    {user.role === 'admin' && (
                      <span
                        style={{
                          background: '#f59e0b',
                          color: '#000',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '0.1rem 0.35rem',
                          borderRadius: '4px',
                        }}
                      >
                        ADMIN
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    title="Sign Out"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Link href="/login" className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                    <LogIn size={15} />
                    <span>Sign In</span>
                  </Link>
                  <Link href="/register" className="btn btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                    <span>Get Started</span>
                  </Link>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
