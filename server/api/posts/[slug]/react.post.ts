import { db } from '../../../utils/db';
import { posts, reactions } from '../../../database/schema';
import { eq, and } from 'drizzle-orm';
import crypto from 'node:crypto';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Missing slug' });

  const body = await readBody(event);
  const { emoticonId } = body;
  
  if (!emoticonId) throw createError({ statusCode: 400, statusMessage: 'Missing emoticonId' });

  const postRes = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!postRes.length) throw createError({ statusCode: 404, statusMessage: 'Post not found' });
  const postId = postRes[0].id;

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown';

  // Check if reaction exists for this IP
  const existingReaction = await db.select().from(reactions)
    .where(and(
      eq(reactions.postId, postId), 
      eq(reactions.emoticonId, emoticonId),
      eq(reactions.ip, ip)
    ))
    .limit(1);

  if (existingReaction.length) {
    // Toggle off
    await db.delete(reactions)
      .where(eq(reactions.id, existingReaction[0].id));
  } else {
    // Toggle on
    await db.insert(reactions).values({
      id: crypto.randomUUID(),
      postId,
      emoticonId,
      ip
    });
  }

  return { success: true };
});
