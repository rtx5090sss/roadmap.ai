import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { subjects, topics, users, learnerProgress } from '@/db/schema';
import { asc } from 'drizzle-orm';
import AdminStudioClient from '@/components/admin/AdminStudioClient';

export default async function AdminPage() {
  const session = await auth();
  const userRole = (session?.user as unknown as { role?: string })?.role;

  // Protect admin studio: require admin role
  if (userRole !== 'admin') {
    redirect('/login');
  }

  const allSubjects = await db.select().from(subjects).orderBy(asc(subjects.orderIndex));
  const allTopics = await db.select().from(topics).orderBy(asc(topics.orderIndex));
  const allUsers = await db.select().from(users);
  const allProgress = await db.select().from(learnerProgress);

  const stats = {
    learnersCount: allUsers.filter((u) => u.role === 'learner').length,
    tracksCount: allSubjects.length,
    topicsCount: allTopics.length,
    completionsCount: allProgress.filter((p) => p.status === 'completed').length,
  };

  return (
    <AdminStudioClient
      initialSubjects={allSubjects}
      initialTopics={allTopics}
      stats={stats}
    />
  );
}
