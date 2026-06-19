import { db } from '../../utils/db';
import { posts, users, tags, postTags } from '../../database/schema';
import { desc, eq, inArray } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const offset = (page - 1) * limit;

  let baseQuery = db.select({
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
    .leftJoin(users, eq(posts.authorId, users.id));

  if (query.tagId) {
    baseQuery = baseQuery
      .innerJoin(postTags, eq(posts.id, postTags.postId))
      .where(eq(postTags.tagId, query.tagId as string)) as any;
  }

  const data = await baseQuery
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);

  if (data.length > 0) {
    const postIds = data.map(p => p.id);
    const postTagsData = await db.select({
      postId: postTags.postId,
      tagId: tags.id,
      tagName: tags.name
    })
      .from(postTags)
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(inArray(postTags.postId, postIds));

    for (const post of data) {
      (post as any).tags = postTagsData
        .filter(pt => pt.postId === post.id)
        .map(pt => ({ id: pt.tagId, name: pt.tagName }));
    }
  }

  return data;
});
