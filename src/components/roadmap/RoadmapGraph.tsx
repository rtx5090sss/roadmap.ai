'use client';

import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import MilestoneNode from './MilestoneNode';
import confetti from 'canvas-confetti';

interface TopicItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  orderIndex: number;
  estimatedMinutes: number;
}

interface RoadmapGraphProps {
  topics: TopicItem[];
  trackSlug: string;
  progressMap: Record<string, 'not_started' | 'in_progress' | 'completed'>;
  onStatusChange?: (topicId: string, status: 'not_started' | 'in_progress' | 'completed') => void;
}

const nodeTypes = {
  milestone: MilestoneNode,
};

export default function RoadmapGraph({
  topics,
  trackSlug,
  progressMap,
  onStatusChange,
}: RoadmapGraphProps) {
  const handleStatusUpdate = useCallback(
    (topicId: string, status: 'not_started' | 'in_progress' | 'completed') => {
      if (status === 'completed') {
        // Trigger celebratory confetti micro-animation
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#38bdf8', '#22c55e', '#a855f7'],
          });
        } catch {}
      }
      onStatusChange?.(topicId, status);
    },
    [onStatusChange]
  );

  // Generate nodes and edges with serpentine / vertical roadmap alignment
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const startX = 350;
    const startY = 60;
    const verticalGap = 160;
    const horizontalSway = 120; // gentle serpentine wave

    topics.forEach((topic, idx) => {
      const status = progressMap[topic.id] || 'not_started';
      const xOffset = Math.sin((idx * Math.PI) / 2) * horizontalSway;

      nodes.push({
        id: topic.id,
        type: 'milestone',
        position: { x: startX + xOffset, y: startY + idx * verticalGap },
        data: {
          id: topic.id,
          title: topic.title,
          slug: topic.slug,
          trackSlug,
          orderIndex: topic.orderIndex ?? idx,
          estimatedMinutes: topic.estimatedMinutes ?? 45,
          status,
          onStatusChange: handleStatusUpdate,
        },
      });

      if (idx > 0) {
        const prevTopic = topics[idx - 1];
        const prevStatus = progressMap[prevTopic.id] || 'not_started';
        const isPrevCompleted = prevStatus === 'completed';
        const isCurrInProgress = status === 'in_progress';

        edges.push({
          id: `edge-${prevTopic.id}-${topic.id}`,
          source: prevTopic.id,
          target: topic.id,
          animated: isCurrInProgress || (isPrevCompleted && status !== 'completed'),
          style: {
            stroke: isPrevCompleted ? '#10b981' : isCurrInProgress ? '#38bdf8' : 'rgba(255, 255, 255, 0.2)',
            strokeWidth: isPrevCompleted ? 3 : 2,
          },
        });
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [topics, trackSlug, progressMap, handleStatusUpdate]);

  return (
    <div style={{ width: '100%', height: '700px', position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-primary)' }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.4}
        maxZoom={1.5}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color="rgba(255, 255, 255, 0.08)"
        />
        <Controls showInteractive={false} position="bottom-right" />
      </ReactFlow>
    </div>
  );
}
