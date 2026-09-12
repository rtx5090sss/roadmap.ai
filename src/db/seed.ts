import { client, db } from './index';
import { users, subjects, topics } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import seedData from './seed-data.json';

async function main() {
  console.log('🌱 Starting database initialization and seeding...');

  // Create tables if they do not exist
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      role TEXT NOT NULL DEFAULT 'learner',
      avatar TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT 'BookOpen',
      color TEXT NOT NULL DEFAULT '#3b82f6',
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      description TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      resource_links TEXT NOT NULL DEFAULT '[]',
      order_index INTEGER NOT NULL DEFAULT 0,
      estimated_minutes INTEGER NOT NULL DEFAULT 45,
      created_at INTEGER NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS learner_progress (
      id TEXT PRIMARY KEY,
      userId TEXT,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      topic_id TEXT REFERENCES topics(id) ON DELETE CASCADE,
      subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'not_started',
      updated_at INTEGER NOT NULL,
      completed_at INTEGER
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS streaks (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 1
    );
  `);

  console.log('✅ Tables verified.');

  // Create default admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@roadmap.dev';
  const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';

  const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);

  if (existingAdmin.length === 0) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await db.insert(users).values({
      id: 'usr-admin-01',
      name: 'System Administrator',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`👤 Admin created: ${adminEmail}`);
  } else {
    console.log(`👤 Admin already exists: ${adminEmail}`);
  }

  // Create demo learner
  const demoEmail = 'learner@roadmap.dev';
  const existingLearner = await db.select().from(users).where(eq(users.email, demoEmail)).limit(1);
  if (existingLearner.length === 0) {
    const hashedPassword = await bcrypt.hash('learner123', 10);
    await db.insert(users).values({
      id: 'usr-learner-01',
      name: 'Alex Learner',
      email: demoEmail,
      password: hashedPassword,
      role: 'learner',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`🎓 Demo learner created: ${demoEmail}`);
  }

  // Seed subjects and topics
  for (const sub of seedData.subjects) {
    const existingSub = await db.select().from(subjects).where(eq(subjects.slug, sub.slug)).limit(1);
    if (existingSub.length === 0) {
      await db.insert(subjects).values({
        id: sub.id,
        title: sub.title,
        slug: sub.slug,
        description: sub.description,
        icon: sub.icon,
        color: sub.color,
        orderIndex: sub.orderIndex,
        createdAt: new Date(),
      });
      console.log(`📚 Subject added: ${sub.title}`);
    }

    for (const top of sub.topics) {
      const existingTop = await db.select().from(topics).where(eq(topics.id, top.id)).limit(1);
      if (existingTop.length === 0) {
        await db.insert(topics).values({
          id: top.id,
          subjectId: sub.id,
          title: top.title,
          slug: top.slug,
          description: top.description,
          content: top.content,
          resourceLinks: JSON.stringify(top.resourceLinks),
          orderIndex: top.orderIndex,
          estimatedMinutes: top.estimatedMinutes,
          createdAt: new Date(),
        });
        console.log(`   🔹 Topic added: ${top.title}`);
      }
    }
  }

  console.log('🎉 Database seeding complete!');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
