'use client';

import React, { useState, useEffect } from 'react';
import RoadmapGraph from './RoadmapGraph';
import { Clock, Layers } from 'lucide-react';
import Link from 'next/link';

interface TopicItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  orderIndex: number;
  estimatedMinutes: number;
}

interface SubjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  color: string;
}

interface TrackRoadmapClientProps {
  subject: SubjectItem;
  topics: TopicItem[];
}

export default function TrackRoadmapClient({ subject, topics }: TrackRoadmapClientProps) {
  const [progressMap, setProgressMap] = useState<Record<string, 'not_started' | 'in_progress' | 'completed'>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [activeTopic, setActiveTopic] = useState<TopicItem | null>(topics[0] || null);

  // Fetch current user progress for this subject
  useEffect(() => {
    fetch(`/api/progress?subjectId=${subject.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.progress) {
          const map: Record<string, 'not_started' | 'in_progress' | 'completed'> = {};
          data.progress.forEach((p: { topicId: string; status: 'not_started' | 'in_progress' | 'completed' }) => {
            map[p.topicId] = p.status;
          });
          setProgressMap(map);
        }
      })
      .catch(() => {});
  }, [subject.id]);

  const handleStatusChange = async (
    topicId: string,
    status: 'not_started' | 'in_progress' | 'completed'
  ) => {
    // Optimistic UI update
    setProgressMap((prev) => ({
      ...prev,
      [topicId]: status,
    }));

    setIsSaving(true);
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId,
          subjectId: subject.id,
          status,
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert('Sign in to save your personal progress on this roadmap!');
        }
      }
    } catch {
      // ignore
    } finally {
      setIsSaving(false);
    }
  };

  const completedCount = topics.filter((t) => progressMap[t.id] === 'completed').length;
  const inProgressCount = topics.filter((t) => progressMap[t.id] === 'in_progress').length;
  const percentComplete = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem' }}>
      {/* Header bar */}
      <div
        style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '1.75rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              ACTIVE ROADMAP
            </span>
            {isSaving && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Saving progress...
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>{subject.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            {subject.description}
          </p>
        </div>

        {/* Progress tracker widget */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
            minWidth: '260px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Track Progress</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>{percentComplete}%</span>
          </div>

          <div className="progress-container" style={{ marginBottom: '0.75rem' }}>
            <div className="progress-fill" style={{ width: `${percentComplete}%` }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>{completedCount} of {topics.length} done</span>
            {inProgressCount > 0 && <span style={{ color: '#fbbf24' }}>{inProgressCount} in progress</span>}
          </div>
        </div>
      </div>

      {/* Main Roadmap Area: Graph on left, Milestones drawer on right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '1.5rem', alignItems: 'start' }}>
        {/* React Flow Interactive Graph */}
        <div>
          <RoadmapGraph
            topics={topics}
            trackSlug={subject.slug}
            progressMap={progressMap}
            onStatusChange={handleStatusChange}
          />
        </div>

        {/* Milestones Sidebar List */}
        <div
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            maxHeight: '700px',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={18} color="#38bdf8" />
              <span>Milestones ({topics.length})</span>
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topics.map((top, idx) => {
              const status = progressMap[top.id] || 'not_started';
              const isCompleted = status === 'completed';
              const isInProgress = status === 'in_progress';

              return (
                <div
                  key={top.id}
                  onClick={() => setActiveTopic(top)}
                  style={{
                    background:
                      activeTopic?.id === top.id ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${
                      activeTopic?.id === top.id
                        ? 'rgba(56, 189, 248, 0.4)'
                        : isCompleted
                        ? 'rgba(34, 197, 94, 0.3)'
                        : 'var(--border-primary)'
                    }`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.9rem',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      #{idx + 1}
                    </span>
                    {isCompleted ? (
                      <span className="badge badge-completed" style={{ fontSize: '0.65rem' }}>
                        Done
                      </span>
                    ) : isInProgress ? (
                      <span className="badge badge-in-progress" style={{ fontSize: '0.65rem' }}>
                        In Progress
                      </span>
                    ) : (
                      <span className="badge badge-not-started" style={{ fontSize: '0.65rem' }}>
                        Not Started
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/tracks/${subject.slug}/${top.slug}`}
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: isCompleted ? '#4ade80' : '#f8fafc',
                      display: 'block',
                      marginBottom: '0.5rem',
                      lineHeight: '1.4',
                    }}
                  >
                    {top.title}
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Clock size={11} /> {top.estimatedMinutes}m
                    </span>

                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      {status !== 'completed' && (
                        <button
                          onClick={() => handleStatusChange(top.id, 'completed')}
                          style={{
                            background: 'rgba(34, 197, 94, 0.15)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            color: '#4ade80',
                            borderRadius: '4px',
                            padding: '0.15rem 0.45rem',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          ✓
                        </button>
                      )}
                      {status !== 'in_progress' && (
                        <button
                          onClick={() => handleStatusChange(top.id, 'in_progress')}
                          style={{
                            background: 'rgba(245, 158, 11, 0.15)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            color: '#fbbf24',
                            borderRadius: '4px',
                            padding: '0.15rem 0.45rem',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          ▶
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
