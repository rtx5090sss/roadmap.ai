import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { subjects, topics, learnerProgress, streaks } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import Link from 'next/link';
import {
  CheckCircle2,
  Flame,
  Terminal,
  Cloud,
  ArrowRight,
  TrendingUp,
  Award,
  PlayCircle,
} from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;
  const userName = session.user.name || session.user.email?.split('@')[0] || 'Learner';

  const allSubjects = await db.select().from(subjects).orderBy(asc(subjects.orderIndex));
  const allTopics = await db.select().from(topics).orderBy(asc(topics.orderIndex));
  const userProgress = await db.select().from(learnerProgress).where(eq(learnerProgress.userId, userId));
  const userStreaks = await db.select().from(streaks).where(eq(streaks.userId, userId));

  const totalTopicsCount = allTopics.length;
  const completedCount = userProgress.filter((p) => p.status === 'completed').length;
  const inProgressCount = userProgress.filter((p) => p.status === 'in_progress').length;
  const overallPercent = totalTopicsCount > 0 ? Math.round((completedCount / totalTopicsCount) * 100) : 0;
  const streakDays = userStreaks.length;

  // In-progress topics
  const inProgressTopicIds = userProgress.filter((p) => p.status === 'in_progress').map((p) => p.topicId);
  const activeTopics = allTopics.filter((t) => inProgressTopicIds.includes(t.id));

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '2.5rem',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="card-glowing"
      >
        <div style={{ maxWidth: '650px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            <TrendingUp size={14} />
            <span>LEARNER DASHBOARD</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Welcome back, {userName}!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Pick up right where you left off. You have completed {completedCount} milestones across your active roadmaps.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(34, 197, 94, 0.15)',
              color: '#4ade80',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>{completedCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Completed Milestones</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlayCircle size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>{inProgressCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>In Progress</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Flame size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>{streakDays}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Streak Days</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Award size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>{overallPercent}%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Overall Completion</div>
          </div>
        </div>
      </div>

      {/* Track Progress Breakdown */}
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Track Progress</h2>
      <div className="grid-cards" style={{ marginBottom: '3.5rem' }}>
        {allSubjects.map((sub) => {
          const subTopics = allTopics.filter((t) => t.subjectId === sub.id);
          const subProgress = userProgress.filter((p) => p.subjectId === sub.id && p.status === 'completed');
          const subPct = subTopics.length > 0 ? Math.round((subProgress.length / subTopics.length) * 100) : 0;
          const isDevOps = sub.slug === 'devops';

          return (
            <div key={sub.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: isDevOps ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: sub.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isDevOps ? <Terminal size={20} /> : <Cloud size={20} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem' }}>{sub.title}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {subProgress.length} / {subTopics.length} completed
                    </span>
                  </div>
                </div>

                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>{subPct}%</span>
              </div>

              <div className="progress-container" style={{ marginBottom: '1.25rem' }}>
                <div className="progress-fill" style={{ width: `${subPct}%` }} />
              </div>

              <Link
                href={`/tracks/${sub.slug}`}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.85rem' }}
              >
                <span>Continue Roadmap</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          );
        })}
      </div>

      {/* In-Progress Topics Section */}
      {activeTopics.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>Currently In Progress</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {activeTopics.map((top) => {
              const sub = allSubjects.find((s) => s.id === top.subjectId);
              return (
                <div key={top.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="badge badge-in-progress">In Progress</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub?.title}</span>
                    </div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>{top.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
                      {top.description}
                    </p>
                  </div>
                  <Link
                    href={`/tracks/${sub?.slug}/${top.slug}`}
                    className="btn btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                  >
                    <span>Jump to Guide</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
