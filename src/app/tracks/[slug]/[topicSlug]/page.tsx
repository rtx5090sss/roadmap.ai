import { notFound } from 'next/navigation';
import { db } from '@/db';
import { subjects, topics } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import TopicDetailClient from '@/components/roadmap/TopicDetailClient';

interface PageProps {
  params: Promise<{ slug: string; topicSlug: string }>;
}

export default async function TopicDetailPage({ params }: PageProps) {
  const { slug, topicSlug } = await params;

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

  const currentIdx = trackTopics.findIndex((t) => t.slug === topicSlug);
  if (currentIdx === -1) {
    notFound();
  }

  const topic = trackTopics[currentIdx];
  const prevTopic = currentIdx > 0 ? trackTopics[currentIdx - 1] : null;
  const nextTopic = currentIdx < trackTopics.length - 1 ? trackTopics[currentIdx + 1] : null;

  return (
    <TopicDetailClient
      subject={subject}
      topic={topic}
      prevTopic={prevTopic}
      nextTopic={nextTopic}
    />
  );
}
