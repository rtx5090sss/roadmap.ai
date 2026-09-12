import { NextResponse } from 'next/server';
import { db } from '@/db';
import { topics, subjects } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await props.params;
    const foundTopics = await db.select().from(topics).where(eq(topics.slug, slug)).limit(1);

    if (foundTopics.length === 0) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    const topic = foundTopics[0];
    const subject = await db.select().from(subjects).where(eq(subjects.id, topic.subjectId)).limit(1);

    return NextResponse.json({
      topic: {
        ...topic,
        resourceLinks: JSON.parse(topic.resourceLinks || '[]'),
      },
      subject: subject[0] || null,
    });
  } catch (error) {
    console.error('Error fetching topic by slug:', error);
    return NextResponse.json({ error: 'Failed to fetch topic' }, { status: 500 });
  }
}
