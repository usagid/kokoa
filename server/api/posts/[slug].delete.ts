import { db } from '../../utils/db';
import { posts } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const session = await useSession(event, {
    password: process.env.SESSION_PASSWORD || 'your-super-secret-password-that-is-at-least-32-characters-long'
  });
  if (!session.data.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const slug = getRouterParam(event, 'slug');
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Missing slug' });

  await db.delete(posts).where(eq(posts.slug, slug));
  
  return { success: true };
});
