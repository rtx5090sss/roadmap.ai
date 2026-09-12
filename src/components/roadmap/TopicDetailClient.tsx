'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  PlayCircle,
  Circle,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
} from 'lucide-react';

interface ResourceLink {
  label: string;
  url: string;
  type: string;
}

interface TopicData {
  id: string;
  subjectId: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  resourceLinks: string;
  estimatedMinutes: number;
}

interface SubjectData {
  id: string;
  title: string;
  slug: string;
}

interface TopicDetailClientProps {
  subject: SubjectData;
  topic: TopicData;
  prevTopic: TopicData | null;
  nextTopic: TopicData | null;
}

export default function TopicDetailClient({
  subject,
  topic,
  prevTopic,
  nextTopic,
}: TopicDetailClientProps) {
  const [status, setStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetch(`/api/progress?subjectId=${subject.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.progress) {
          const rec = data.progress.find((p: { topicId: string }) => p.topicId === topic.id);
          if (rec) {
            setStatus(rec.status);
          }
        }
      })
      .catch(() => {});
  }, [subject.id, topic.id]);

  const handleSetStatus = async (newStatus: 'not_started' | 'in_progress' | 'completed') => {
    setStatus(newStatus);
    if (newStatus === 'completed') {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#22c55e', '#a855f7'],
        });
      } catch {}
    }

    setIsUpdating(true);
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: topic.id,
          subjectId: subject.id,
          status: newStatus,
        }),
      });

      if (!res.ok && res.status === 401) {
        alert('Please sign in to save your learning progress!');
      }
    } catch {
      // ignore
    } finally {
      setIsUpdating(false);
    }
  };

  const parsedResources: ResourceLink[] = React.useMemo(() => {
    try {
      return JSON.parse(topic.resourceLinks || '[]');
    } catch {
      return [];
    }
  }, [topic.resourceLinks]);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem', maxWidth: '960px' }}>
      {/* Breadcrumb navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
        <Link href={`/tracks/${subject.slug}`} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <ArrowLeft size={14} />
          <span>Back to {subject.title} Roadmap</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div
        style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          marginBottom: '2.5rem',
        }}
        className="card-glowing"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {subject.title}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={13} /> {topic.estimatedMinutes} minutes
            </span>
            {isUpdating && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Saving...
              </span>
            )}
          </div>

          {/* Status Switcher Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => handleSetStatus('not_started')}
              className={`btn ${status === 'not_started' ? 'btn-secondary' : ''}`}
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.75rem',
                background: status === 'not_started' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                border: '1px solid var(--border-primary)',
              }}
            >
              <Circle size={11} />
              <span>Not Started</span>
            </button>

            <button
              onClick={() => handleSetStatus('in_progress')}
              className="btn btn-amber"
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.75rem',
                opacity: status === 'in_progress' ? 1 : 0.65,
              }}
            >
              <PlayCircle size={11} />
              <span>In Progress</span>
            </button>

            <button
              onClick={() => handleSetStatus('completed')}
              className="btn btn-success"
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.75rem',
                opacity: status === 'completed' ? 1 : 0.65,
              }}
            >
              <CheckCircle2 size={11} />
              <span>Done ✓</span>
            </button>
          </div>
        </div>

        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>{topic.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
          {topic.description}
        </p>
      </div>

      {/* Main Markdown Content */}
      <div
        style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '2.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {topic.content || '# Guide coming soon\n\nContent for this milestone is currently being updated.'}
          </ReactMarkdown>
        </div>
      </div>

      {/* Curated Resources */}
      {parsedResources.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} color="#38bdf8" />
            <span>Recommended Engineering Resources</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {parsedResources.map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(56, 189, 248, 0.1)',
                      color: '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {res.type === 'video' ? <Video size={18} /> : <FileText size={18} />}
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{res.label}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.url}</span>
                  </div>
                </div>
                <ExternalLink size={16} color="var(--text-secondary)" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Prev / Next milestone footer navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--border-primary)', paddingTop: '2rem' }}>
        {prevTopic ? (
          <Link
            href={`/tracks/${subject.slug}/${prevTopic.slug}`}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PREVIOUS</div>
              <div style={{ fontSize: '0.85rem' }}>{prevTopic.title}</div>
            </div>
          </Link>
        ) : <div />}

        {nextTopic ? (
          <Link
            href={`/tracks/${subject.slug}/${nextTopic.slug}`}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>NEXT MILESTONE</div>
              <div style={{ fontSize: '0.85rem' }}>{nextTopic.title}</div>
            </div>
            <ArrowRight size={16} />
          </Link>
        ) : (
          <Link href={`/tracks/${subject.slug}`} className="btn btn-success">
            <span>Review Roadmap Graph</span>
            <CheckCircle2 size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
