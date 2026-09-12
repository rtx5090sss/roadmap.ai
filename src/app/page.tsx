import Link from 'next/link';
import { db } from '@/db';
import { subjects, topics } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { Compass, Terminal, Cloud, CheckCircle2, ArrowRight, Flame, Sparkles, Layers } from 'lucide-react';

export default async function HomePage() {
  const allSubjects = await db.select().from(subjects).orderBy(asc(subjects.orderIndex));
  const allTopics = await db.select().from(topics).orderBy(asc(topics.orderIndex));

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background radial ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '600px',
          background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.18), rgba(99, 102, 241, 0.08) 45%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Hero Section */}
      <section style={{ position: 'relative', zIndex: 1, padding: '5rem 0 3.5rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#38bdf8',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.75rem',
            }}
          >
            <Sparkles size={15} />
            <span>Interactive Node-Graph Learning Platform</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              lineHeight: '1.15',
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
              fontWeight: 800,
            }}
          >
            Architect Your Mastery with{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Visual Tech Roadmaps
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              lineHeight: '1.7',
              color: 'var(--text-secondary)',
              marginBottom: '2.5rem',
              maxWidth: '720px',
              marginRight: 'auto',
              marginLeft: 'auto',
            }}
          >
            Break down complex engineering disciplines like <strong>DevOps</strong> and{' '}
            <strong>Cloud Engineering</strong> into milestones. Explore interactive nodes, track your progress, and build continuous streaks.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/tracks/devops" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              <Terminal size={18} />
              <span>Launch DevOps Roadmap</span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/tracks" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              <Layers size={18} />
              <span>Browse All Tracks</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tracks Catalog */}
      <section style={{ padding: '3rem 0 5rem 0', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Core Learning Tracks</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                Handcrafted curriculum designed by senior engineers for real-world infrastructure.
              </p>
            </div>
            <Link href="/tracks" style={{ color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
              <span>View all tracks</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-cards">
            {allSubjects.map((sub) => {
              const subTopics = allTopics.filter((t) => t.subjectId === sub.id);
              const isDevOps = sub.slug === 'devops';

              return (
                <div key={sub.id} className="card card-glowing" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: 'var(--radius-sm)',
                        background: isDevOps ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        border: `1px solid ${isDevOps ? 'rgba(56, 189, 248, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: sub.color,
                      }}
                    >
                      {isDevOps ? <Terminal size={24} /> : <Cloud size={24} />}
                    </div>

                    <span className="badge badge-in-progress" style={{ fontSize: '0.75rem' }}>
                      {subTopics.length} Milestones
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.65rem' }}>{sub.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.6', marginBottom: '1.5rem', flexGrow: 1 }}>
                    {sub.description}
                  </p>

                  {/* Sample topic pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                    {subTopics.slice(0, 5).map((top) => (
                      <span
                        key={top.id}
                        style={{
                          fontSize: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '4px',
                          color: '#cbd5e1',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        {top.title.split(' ')[0]}
                      </span>
                    ))}
                    {subTopics.length > 5 && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.5rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        +{subTopics.length - 5} more
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/tracks/${sub.slug}`}
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'space-between' }}
                  >
                    <span>Open Interactive Graph</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section style={{ padding: '4rem 0', background: 'rgba(15, 23, 42, 0.4)', borderTop: '1px solid var(--border-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Engineered for Deep Learning</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Everything you need to systematically progress from beginner to senior architect.
            </p>
          </div>

          <div className="grid-cards">
            <div className="card">
              <div style={{ color: '#38bdf8', marginBottom: '1rem' }}>
                <Compass size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Connected Milestone Graphs</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Interactive React Flow canvas with pan, zoom, custom milestone nodes, and glowing path connectors.
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#22c55e', marginBottom: '1rem' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Live Progress Tracking</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Mark milestones as In Progress or Completed with one click. Visual confetti rewards your accomplishments.
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#f59e0b', marginBottom: '1rem' }}>
                <Flame size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Streak Motivation</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Maintain daily learning streaks and monitor completion velocity on your personal learner dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
