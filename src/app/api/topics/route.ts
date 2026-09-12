import { NextResponse } from 'next/server';
import { db } from '@/db';
import { topics } from '@/db/schema';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userRole = (session?.user as unknown as { role?: string })?.role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { subjectId, title, slug, description, content, resourceLinks, orderIndex, estimatedMinutes } = body;

    if (!subjectId || !title || !slug || !description) {
      return NextResponse.json({ error: 'Subject ID, title, slug, and description are required' }, { status: 400 });
    }

    const id = 'top-' + Date.now().toString(36);

    await db.insert(topics).values({
      id,
      subjectId,
      title,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      description,
      content: content || '',
      resourceLinks: JSON.stringify(resourceLinks || []),
      orderIndex: orderIndex ?? 0,
      estimatedMinutes: estimatedMinutes ?? 45,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error('Error creating topic:', error);
    return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 });
  }
}
