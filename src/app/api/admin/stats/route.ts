import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, subjects, topics, learnerProgress } from '@/db/schema';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    const userRole = (session?.user as unknown as { role?: string })?.role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const allUsers = await db.select().from(users);
    const allSubjects = await db.select().from(subjects);
    const allTopics = await db.select().from(topics);
    const allProgress = await db.select().from(learnerProgress);

    const totalLearners = allUsers.filter((u) => u.role === 'learner').length;
    const totalCompletions = allProgress.filter((p) => p.status === 'completed').length;

    return NextResponse.json({
      stats: {
        learnersCount: totalLearners,
        tracksCount: allSubjects.length,
        topicsCount: allTopics.length,
        completionsCount: totalCompletions,
      },
      recentUsers: allUsers.slice(-5).map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role })),
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
