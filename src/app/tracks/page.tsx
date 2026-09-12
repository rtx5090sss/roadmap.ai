import Link from 'next/link';
import { db } from '@/db';
import { subjects, topics } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { Terminal, Cloud, ArrowRight, Clock, BookOpen, Layers } from 'lucide-react';

export default async function TracksPage() {
  const allSubjects = await db.select().from(subjects).orderBy(asc(subjects.orderIndex));
  const allTopics = await db.select().from(topics).orderBy(asc(topics.orderIndex));

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.8rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            color: '#38bdf8',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '1rem',
          }}
        >
          <Layers size={14} />
          <span>Curated Learning Paths</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Engineering Roadmaps</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '700px' }}>
          Choose a discipline below to view its visual milestone graph, dive into topic guides, and track your completion status.
        </p>
      </div>

      <div className="grid-cards">
        {allSubjects.map((sub) => {
          const subTopics = allTopics.filter((t) => t.subjectId === sub.id);
          const totalMinutes = subTopics.reduce((acc, t) => acc + (t.estimatedMinutes || 45), 0);
          const totalHours = (totalMinutes / 60).toFixed(1);
          const isDevOps = sub.slug === 'devops';

          return (
            <div key={sub.id} className="card card-glowing" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: 'var(--radius-sm)',
                    background: isDevOps ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    border: `1px solid ${isDevOps ? 'rgba(56, 189, 248, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: sub.color,
                  }}
                >
                  {isDevOps ? <Terminal size={26} /> : <Cloud size={26} />}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="badge badge-not-started" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <BookOpen size={12} /> {subTopics.length} Milestones
                  </span>
                  <span className="badge badge-not-started" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={12} /> ~{totalHours}h
                  </span>
                </div>
              </div>

              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{sub.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.75rem', flexGrow: 1 }}>
                {sub.description}
              </p>

              {/* Topics list */}
              <div style={{ marginBottom: '1.75rem' }}>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  Included Milestones
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {subTopics.map((top, idx) => (
                    <span
                      key={top.id}
                      style={{
                        fontSize: '0.8rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      {idx + 1}. {top.title}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`/tracks/${sub.slug}`}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span>Launch Interactive Roadmap</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
