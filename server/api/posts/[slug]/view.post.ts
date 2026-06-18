import { db } from '../../../utils/db';
import { posts } from '../../../database/schema';
import { eq, sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Missing slug' });

  const postRes = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!postRes.length) throw createError({ statusCode: 404, statusMessage: 'Post not found' });

  await db.update(posts)
    .set({ viewsCount: sql`${posts.viewsCount} + 1` })
    .where(eq(posts.id, postRes[0].id));

  return { success: true };
});
