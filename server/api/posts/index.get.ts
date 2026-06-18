import { db } from '../../utils/db';
import { posts, users } from '../../database/schema';
import { desc, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const offset = (page - 1) * limit;

  const data = await db.select({
    id: posts.id,
    title: posts.title,
    slug: posts.slug,
    content: posts.content,
    viewsCount: posts.viewsCount,
    authorId: posts.authorId,
    createdAt: posts.createdAt,
    authorName: users.username,
  })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);

  return data;
});
