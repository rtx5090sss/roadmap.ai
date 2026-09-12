import { notFound } from 'next/navigation';
import { db } from '@/db';
import { subjects, topics } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import TrackRoadmapClient from '@/components/roadmap/TrackRoadmapClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TrackDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const foundSubjects = await db.select().from(subjects).where(eq(subjects.slug, slug)).limit(1);
  if (foundSubjects.length === 0) {
    notFound();
  }

  const subject = foundSubjects[0];
  const trackTopics = await db
    .select()
    .from(topics)
    .where(eq(topics.subjectId, subject.id))
    .orderBy(asc(topics.orderIndex));

  return <TrackRoadmapClient subject={subject} topics={trackTopics} />;
}
