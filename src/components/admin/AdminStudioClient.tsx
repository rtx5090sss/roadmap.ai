'use client';

import React, { useState } from 'react';
import { Shield, PlusCircle, Layers } from 'lucide-react';

interface SubjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  color: string;
}

interface TopicItem {
  id: string;
  subjectId: string;
  title: string;
  slug: string;
  estimatedMinutes: number;
}

interface StatsData {
  learnersCount: number;
  tracksCount: number;
  topicsCount: number;
  completionsCount: number;
}

interface AdminStudioClientProps {
  initialSubjects: SubjectItem[];
  initialTopics: TopicItem[];
  stats: StatsData;
}

export default function AdminStudioClient({
  initialSubjects,
  initialTopics,
  stats,
}: AdminStudioClientProps) {
  const [subjectsList, setSubjectsList] = useState(initialSubjects);
  const [topicsList, setTopicsList] = useState(initialTopics);

  // Subject Form State
  const [subTitle, setSubTitle] = useState('');
  const [subSlug, setSubSlug] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [subColor, setSubColor] = useState('#38bdf8');
  const [subLoading, setSubLoading] = useState(false);
  const [subMsg, setSubMsg] = useState('');

  // Topic Form State
  const [selectedSubId, setSelectedSubId] = useState(initialSubjects[0]?.id || '');
  const [topTitle, setTopTitle] = useState('');
  const [topSlug, setTopSlug] = useState('');
  const [topDesc, setTopDesc] = useState('');
  const [topMinutes, setTopMinutes] = useState(45);
  const [topContent, setTopContent] = useState('');
  const [topLoading, setTopLoading] = useState(false);
  const [topMsg, setTopMsg] = useState('');

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubLoading(true);
    setSubMsg('');

    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: subTitle,
          slug: subSlug,
          description: subDesc,
          color: subColor,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create subject');

      setSubMsg('✅ Subject created successfully!');
      setSubjectsList([
        ...subjectsList,
        {
          id: data.id,
          title: subTitle,
          slug: subSlug,
          description: subDesc,
          color: subColor,
        },
      ]);
      setSubTitle('');
      setSubSlug('');
      setSubDesc('');
    } catch (err: unknown) {
      setSubMsg('❌ ' + (err instanceof Error ? err.message : 'Error creating track'));
    } finally {
      setSubLoading(false);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setTopLoading(true);
    setTopMsg('');

    try {
      const res = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: selectedSubId,
          title: topTitle,
          slug: topSlug,
          description: topDesc,
          estimatedMinutes: Number(topMinutes),
          content: topContent,
          resourceLinks: [],
          orderIndex: topicsList.filter((t) => t.subjectId === selectedSubId).length,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create topic');

      setTopMsg('✅ Topic added to roadmap successfully!');
      setTopicsList([
        ...topicsList,
        {
          id: data.id,
          subjectId: selectedSubId,
          title: topTitle,
          slug: topSlug,
          estimatedMinutes: Number(topMinutes),
        },
      ]);
      setTopTitle('');
      setTopSlug('');
      setTopDesc('');
      setTopContent('');
    } catch (err: unknown) {
      setTopMsg('❌ ' + (err instanceof Error ? err.message : 'Error creating topic'));
    } finally {
      setTopLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <div
          style={{
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#f59e0b',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            fontWeight: 700,
          }}
        >
          <Shield size={14} />
          <span>ADMIN STUDIO</span>
        </div>
      </div>

      <h1 style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>Roadmap & Curriculum Manager</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '2.5rem' }}>
        Add new engineering tracks, configure milestones, write guides, and curate resource links.
      </p>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>TOTAL TRACKS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>{subjectsList.length}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>TOTAL MILESTONES</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#818cf8' }}>{topicsList.length}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>REGISTERED LEARNERS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b' }}>{stats.learnersCount}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>MILESTONES COMPLETED</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#22c55e' }}>{stats.completionsCount}</div>
        </div>
      </div>

      {/* Creator Grids */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        {/* Create Subject/Track */}
        <div className="card card-glowing">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <PlusCircle size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.3rem' }}>Create New Track / Subject</h3>
          </div>

          {subMsg && (
            <div
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: subMsg.includes('✅') ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: subMsg.includes('✅') ? '#4ade80' : '#f87171',
                fontSize: '0.85rem',
                marginBottom: '1rem',
              }}
            >
              {subMsg}
            </div>
          )}

          <form onSubmit={handleCreateSubject}>
            <div className="form-group">
              <label className="form-label">Subject Title</label>
              <input
                type="text"
                className="form-input"
                required
                value={subTitle}
                onChange={(e) => {
                  setSubTitle(e.target.value);
                  if (!subSlug) {
                    setSubSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }
                }}
                placeholder="e.g. Site Reliability Engineering (SRE)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Slug (URL-friendly)</label>
              <input
                type="text"
                className="form-input"
                required
                value={subSlug}
                onChange={(e) => setSubSlug(e.target.value)}
                placeholder="e.g. sre"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                required
                rows={3}
                value={subDesc}
                onChange={(e) => setSubDesc(e.target.value)}
                placeholder="Brief summary of what learners will accomplish in this track..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Theme Color Accent</label>
              <input
                type="color"
                className="form-input"
                style={{ height: '45px', padding: '0.2rem' }}
                value={subColor}
                onChange={(e) => setSubColor(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={subLoading}>
              {subLoading ? 'Creating Track...' : 'Publish Track'}
            </button>
          </form>
        </div>

        {/* Add Topic/Milestone */}
        <div className="card card-glowing">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Layers size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '1.3rem' }}>Add Milestone to Track</h3>
          </div>

          {topMsg && (
            <div
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: topMsg.includes('✅') ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: topMsg.includes('✅') ? '#4ade80' : '#f87171',
                fontSize: '0.85rem',
                marginBottom: '1rem',
              }}
            >
              {topMsg}
            </div>
          )}

          <form onSubmit={handleCreateTopic}>
            <div className="form-group">
              <label className="form-label">Target Subject Track</label>
              <select
                className="form-input"
                value={selectedSubId}
                onChange={(e) => setSelectedSubId(e.target.value)}
              >
                {subjectsList.map((sub) => (
                  <option key={sub.id} value={sub.id} style={{ background: '#0f172a' }}>
                    {sub.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Milestone Title</label>
              <input
                type="text"
                className="form-input"
                required
                value={topTitle}
                onChange={(e) => {
                  setTopTitle(e.target.value);
                  if (!topSlug) {
                    setTopSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }
                }}
                placeholder="e.g. Prometheus & Grafana Monitoring"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Slug</label>
              <input
                type="text"
                className="form-input"
                required
                value={topSlug}
                onChange={(e) => setTopSlug(e.target.value)}
                placeholder="e.g. prometheus-grafana"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Minutes</label>
              <input
                type="number"
                className="form-input"
                min="10"
                max="300"
                value={topMinutes}
                onChange={(e) => setTopMinutes(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Short Description</label>
              <input
                type="text"
                className="form-input"
                required
                value={topDesc}
                onChange={(e) => setTopDesc(e.target.value)}
                placeholder="Key concepts covered in this topic"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Markdown Content Guide</label>
              <textarea
                className="form-input"
                rows={4}
                value={topContent}
                onChange={(e) => setTopContent(e.target.value)}
                placeholder="# Overview&#10;&#10;Explain the concepts, configuration snippets, and best practices..."
              />
            </div>

            <button type="submit" className="btn btn-amber" style={{ width: '100%', marginTop: '0.5rem' }} disabled={topLoading}>
              {topLoading ? 'Adding Milestone...' : 'Attach Milestone to Track'}
            </button>
          </form>
        </div>
      </div>

      {/* Existing Curriculum Directory */}
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Active Tracks Directory</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {subjectsList.map((sub) => {
          const subTopics = topicsList.filter((t) => t.subjectId === sub.id);
          return (
            <div key={sub.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: sub.color }}>{sub.title}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>slug: /{sub.slug}</span>
                </div>
                <span className="badge badge-in-progress">{subTopics.length} Milestones</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {subTopics.map((top, i) => (
                  <span
                    key={top.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-primary)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                    }}
                  >
                    #{i + 1} {top.title}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
