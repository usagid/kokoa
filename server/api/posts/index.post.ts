import { db } from '../../utils/db';
import { posts, users } from '../../database/schema';
import { eq } from 'drizzle-orm';
import crypto from 'node:crypto';

export default defineEventHandler(async (event) => {
  const session = await useSession(event, {
    password: process.env.SESSION_PASSWORD || 'your-super-secret-password-that-is-at-least-32-characters-long'
  });
  if (!session.data.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  const { title, slug, content } = body;
  
  if (!title || !slug || !content) {
    throw createError({ statusCode: 400, statusMessage: 'Missing fields' });
  }

  const user = await db.select().from(users).where(eq(users.id, session.data.id as string)).limit(1);
  if (!user.length) {
    await session.clear();
    throw createError({ statusCode: 401, statusMessage: 'User no longer exists. Please log in again.' });
  }

  const newPost = await db.insert(posts).values({
    id: crypto.randomUUID(),
    title,
    slug,
    content,
    viewsCount: 0,
    authorId: session.data.id as string,
  }).returning();

  return newPost[0];
});
