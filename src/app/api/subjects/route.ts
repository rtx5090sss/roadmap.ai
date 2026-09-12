import { NextResponse } from 'next/server';
import { db } from '@/db';
import { subjects, topics } from '@/db/schema';
import { auth } from '@/auth';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const allSubjects = await db.select().from(subjects).orderBy(asc(subjects.orderIndex));
    const allTopics = await db.select().from(topics);

    const subjectsWithCount = allSubjects.map((sub) => {
      const count = allTopics.filter((t) => t.subjectId === sub.id).length;
      return {
        ...sub,
        topicCount: count,
      };
    });

    return NextResponse.json({ subjects: subjectsWithCount });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userRole = (session?.user as unknown as { role?: string })?.role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { title, slug, description, icon, color, orderIndex } = body;

    if (!title || !slug || !description) {
      return NextResponse.json({ error: 'Title, slug, and description are required' }, { status: 400 });
    }

    const id = 'sub-' + Date.now().toString(36);

    await db.insert(subjects).values({
      id,
      title,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      description,
      icon: icon || 'BookOpen',
      color: color || '#38bdf8',
      orderIndex: orderIndex ?? 0,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error('Error creating subject:', error);
    return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 });
  }
}
