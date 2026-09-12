-- RoadmapEngine Database Schema
-- Compatible with SQLite (local development) and Turso / LibSQL (production cloud)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  role TEXT NOT NULL DEFAULT 'learner' CHECK(role IN ('admin', 'learner')),
  avatar TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 2. Subjects / Tracks Table (e.g. DevOps, Cloud Engineering)
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'BookOpen',
  color TEXT NOT NULL DEFAULT '#38bdf8',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

-- 3. Topics / Milestones Table (e.g. Python, Linux, Docker, K8s)
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

-- 4. Learner Progress Table
CREATE TABLE IF NOT EXISTS learner_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK(status IN ('not_started', 'in_progress', 'completed')),
  updated_at INTEGER NOT NULL,
  completed_at INTEGER
);

-- 5. Learning Streaks Table
CREATE TABLE IF NOT EXISTS streaks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TEXT NOT NULL, -- Format: YYYY-MM-DD
  count INTEGER NOT NULL DEFAULT 1
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_topics_subject_id ON topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_topic ON learner_progress(user_id, topic_id);
CREATE INDEX IF NOT EXISTS idx_streaks_user_date ON streaks(user_id, date);
