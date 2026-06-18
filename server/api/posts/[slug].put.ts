import { db } from '../../utils/db';
import { posts } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const session = await useSession(event, { password: process.env.SESSION_PASSWORD || 'your-super-secret-password-that-is-at-least-32-characters-long' });
  if (!session.data.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });

  const slug = getRouterParam(event, 'slug');
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Missing slug' });

  const body = await readBody(event);
  const { title, content } = body;
  
  if (!title || !content) {
    throw createError({ statusCode: 400, statusMessage: 'Missing fields' });
  }

  const updatedPost = await db.update(posts)
    .set({ title, content })
    .where(eq(posts.slug, slug))
    .returning();

  if (!updatedPost.length) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' });
  }

  return updatedPost[0];
});
