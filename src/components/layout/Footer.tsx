import Link from 'next/link';
import { Compass, Shield, Terminal, Cloud, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-primary)',
        background: 'rgba(8, 12, 20, 0.95)',
        padding: '3.5rem 0 2rem 0',
        marginTop: '6rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          <div>
            <div className="nav-brand" style={{ marginBottom: '1rem' }}>
              <div className="brand-icon">
                <Compass size={20} color="#ffffff" />
              </div>
              <span>Roadmap<span className="brand-badge">Engine</span></span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              An interactive, full-stack roadmap tracking platform for developers, DevOps engineers, and cloud architects.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Explore Tracks
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <Link href="/tracks/devops" className="nav-link">
                  <Terminal size={14} color="#38bdf8" />
                  <span>DevOps Engineering</span>
                </Link>
              </li>
              <li>
                <Link href="/tracks/cloud-engineering" className="nav-link">
                  <Cloud size={14} color="#f59e0b" />
                  <span>Cloud Engineering (AWS)</span>
                </Link>
              </li>
              <li>
                <Link href="/tracks" className="nav-link">
                  <Cpu size={14} color="#a855f7" />
                  <span>All Engineering Tracks</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Architecture & Stack
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span className="badge badge-not-started">Next.js 15</span>
              <span className="badge badge-not-started">React Flow</span>
              <span className="badge badge-not-started">Drizzle ORM</span>
              <span className="badge badge-not-started">Turso / SQLite</span>
              <span className="badge badge-not-started">NextAuth.js v5</span>
              <span className="badge badge-not-started">Vercel & Docker</span>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-primary)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <p>© {new Date().getFullYear()} RoadmapEngine. Built for continuous engineering mastery.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Shield size={14} color="#22c55e" /> Production Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
