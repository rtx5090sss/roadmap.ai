'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckCircle2, Clock, PlayCircle, Circle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface MilestoneNodeData {
  id: string;
  title: string;
  slug: string;
  trackSlug: string;
  orderIndex: number;
  estimatedMinutes: number;
  status: 'not_started' | 'in_progress' | 'completed';
  onStatusChange?: (topicId: string, status: 'not_started' | 'in_progress' | 'completed') => void;
}

export default function MilestoneNode({ data }: { data: MilestoneNodeData }) {
  const { id, title, slug, trackSlug, orderIndex, estimatedMinutes, status, onStatusChange } = data;

  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';

  let borderColor = 'rgba(255, 255, 255, 0.12)';
  let glowStyle = {};
  let statusBadge = (
    <span className="badge badge-not-started">
      <Circle size={10} /> Not Started
    </span>
  );

  if (isCompleted) {
    borderColor = 'var(--accent-emerald)';
    glowStyle = {
      boxShadow: '0 0 25px rgba(16, 185, 129, 0.35)',
      borderColor: 'rgba(16, 185, 129, 0.6)',
    };
    statusBadge = (
      <span className="badge badge-completed">
        <CheckCircle2 size={11} /> Completed
      </span>
    );
  } else if (isInProgress) {
    borderColor = 'var(--accent-amber)';
    glowStyle = {
      boxShadow: '0 0 25px rgba(245, 158, 11, 0.35)',
      borderColor: 'rgba(245, 158, 11, 0.7)',
    };
    statusBadge = (
      <span className="badge badge-in-progress">
        <PlayCircle size={11} /> In Progress
      </span>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(16px)',
        borderRadius: 'var(--radius-md)',
        border: `1.5px solid ${borderColor}`,
        padding: '1.25rem',
        minWidth: '280px',
        maxWidth: '320px',
        color: '#ffffff',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        ...glowStyle,
      }}
      className="milestone-card"
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: isCompleted ? '#10b981' : isInProgress ? '#f59e0b' : '#38bdf8',
          width: 10,
          height: 10,
          border: '2px solid #0f172a',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: isCompleted
                ? 'rgba(16, 185, 129, 0.2)'
                : isInProgress
                ? 'rgba(245, 158, 11, 0.2)'
                : 'rgba(56, 189, 248, 0.15)',
              color: isCompleted ? '#4ade80' : isInProgress ? '#fbbf24' : '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {orderIndex + 1}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} /> {estimatedMinutes}m
          </span>
        </div>
        {statusBadge}
      </div>

      <h4
        style={{
          fontSize: '1rem',
          lineHeight: '1.4',
          marginBottom: '0.75rem',
          fontWeight: 600,
        }}
      >
        {title}
      </h4>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: '0.5rem' }}>
        <Link
          href={`/tracks/${trackSlug}/${slug}`}
          style={{
            fontSize: '0.8rem',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontWeight: 500,
          }}
        >
          <span>Read Guide</span>
          <ExternalLink size={12} />
        </Link>

        {onStatusChange && (
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {status !== 'in_progress' && (
              <button
                onClick={() => onStatusChange(id, 'in_progress')}
                title="Mark In Progress"
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fbbf24',
                  borderRadius: '6px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                In Progress
              </button>
            )}

            {status !== 'completed' && (
              <button
                onClick={() => onStatusChange(id, 'completed')}
                title="Mark Complete"
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#4ade80',
                  borderRadius: '6px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Done ✓
              </button>
            )}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: isCompleted ? '#10b981' : isInProgress ? '#f59e0b' : '#38bdf8',
          width: 10,
          height: 10,
          border: '2px solid #0f172a',
        }}
      />
    </div>
  );
}
