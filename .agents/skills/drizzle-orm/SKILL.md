---
name: drizzle-orm
description: >-
  Best practices for Drizzle ORM schema design, migrations, SQLite local
  storage, and Turso remote database integration.
---

# Drizzle ORM & Turso Best Practices

Derived from `bobmatnyc/claude-mpm-skills/drizzle-orm` on skills.sh:
1. **Schema Design**: Keep schemas declarative in `src/db/schema.ts`. Use foreign keys with cascade deletion.
2. **Unified Client**: Use `@libsql/client` for zero-overhead local SQLite file development and seamless switch to production Turso via `DATABASE_URL` and `DATABASE_AUTH_TOKEN`.
3. **Seeding**: Maintain idempotent seed scripts (`src/db/seed.ts`) that check existence before inserting.
