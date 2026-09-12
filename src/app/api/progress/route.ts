import { NextResponse } from 'next/server';
import { db } from '@/db';
import { learnerProgress, streaks, topics } from '@/db/schema';
import { auth } from '@/auth';
import { and, eq } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ progress: [], stats: { total: 0, completed: 0, inProgress: 0 } });
    }

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId');

    const conditions = [eq(learnerProgress.userId, session.user.id)];
    if (subjectId) {
      conditions.push(eq(learnerProgress.subjectId, subjectId));
    }

    const userProgress = await db
      .select()
      .from(learnerProgress)
      .where(and(...conditions));

    const completed = userProgress.filter((p) => p.status === 'completed').length;
    const inProgress = userProgress.filter((p) => p.status === 'in_progress').length;

    // Get user streak count
    const userStreaks = await db.select().from(streaks).where(eq(streaks.userId, session.user.id));
    const streakDays = userStreaks.length;

    return NextResponse.json({
      progress: userProgress,
      stats: {
        completed,
        inProgress,
        streakDays,
      },
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Please sign in to save your progress' }, { status: 401 });
    }

    const body = await req.json();
    const { topicId, subjectId, status } = body;

    if (!topicId || !status) {
      return NextResponse.json({ error: 'Topic ID and status are required' }, { status: 400 });
    }

    // Lookup topic if subjectId not passed
    let resolvedSubjectId = subjectId;
    if (!resolvedSubjectId) {
      const topicObj = await db.select().from(topics).where(eq(topics.id, topicId)).limit(1);
      if (topicObj.length > 0) {
        resolvedSubjectId = topicObj[0].subjectId;
      }
    }

    const existing = await db
      .select()
      .from(learnerProgress)
      .where(and(eq(learnerProgress.userId, session.user.id), eq(learnerProgress.topicId, topicId)))
      .limit(1);

    const isCompleted = status === 'completed';
    const now = new Date();

    if (existing.length > 0) {
      await db
        .update(learnerProgress)
        .set({
          status,
          updatedAt: now,
          completedAt: isCompleted ? now : null,
        })
        .where(eq(learnerProgress.id, existing[0].id));
    } else {
      const id = 'prog-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      await db.insert(learnerProgress).values({
        id,
        userId: session.user.id,
        topicId,
        subjectId: resolvedSubjectId,
        status,
        updatedAt: now,
        completedAt: isCompleted ? now : null,
      });
    }

    // Update streak if completing a topic
    if (isCompleted) {
      const today = now.toISOString().split('T')[0];
      const existingStreak = await db
        .select()
        .from(streaks)
        .where(and(eq(streaks.userId, session.user.id), eq(streaks.date, today)))
        .limit(1);

      if (existingStreak.length > 0) {
        await db
          .update(streaks)
          .set({ count: existingStreak[0].count + 1 })
          .where(eq(streaks.id, existingStreak[0].id));
      } else {
        await db.insert(streaks).values({
          id: 'strk-' + Date.now().toString(36),
          userId: session.user.id,
          date: today,
          count: 1,
        });
      }
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
