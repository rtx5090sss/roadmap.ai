import { NextResponse } from 'next/server';
import { db } from '@/db';
import { subjects, topics } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await props.params;
    const foundSubjects = await db.select().from(subjects).where(eq(subjects.slug, slug)).limit(1);

    if (foundSubjects.length === 0) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    const subject = foundSubjects[0];
    const trackTopics = await db
      .select()
      .from(topics)
      .where(eq(topics.subjectId, subject.id))
      .orderBy(asc(topics.orderIndex));

    return NextResponse.json({ subject, topics: trackTopics });
  } catch (error) {
    console.error('Error fetching subject by slug:', error);
    return NextResponse.json({ error: 'Failed to fetch track' }, { status: 500 });
  }
}
