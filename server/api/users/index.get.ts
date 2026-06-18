import { db } from '../../utils/db';
import { users } from '../../database/schema';

export default defineEventHandler(async (event) => {
  const session = await useSession(event, {
    password: process.env.SESSION_PASSWORD || 'your-super-secret-password-that-is-at-least-32-characters-long'
  });
  if (!session.data.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 100;
  const offset = (page - 1) * limit;

  const data = await db.select({
    id: users.id,
    username: users.username,
    createdAt: users.createdAt
  }).from(users).limit(limit).offset(offset);

  return data;
});
