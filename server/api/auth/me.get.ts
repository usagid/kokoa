import { db } from '../../utils/db';
import { users } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const session = await useSession(event, {
    password: process.env.SESSION_PASSWORD || 'your-super-secret-password-that-is-at-least-32-characters-long'
  });
  if (!session.data.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const user = await db.select().from(users).where(eq(users.id, session.data.id as string)).limit(1);
  if (!user.length) {
    await session.clear();
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  return session.data;
});
