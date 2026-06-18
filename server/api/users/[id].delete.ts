import { db } from '../../utils/db';
import { users } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const session = await useSession(event, { password: process.env.SESSION_PASSWORD || 'your-super-secret-password-that-is-at-least-32-characters-long' });
  if (!session.data.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });

  const id = getRouterParam(event, 'id');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing ID' });

  // Prevent deleting oneself
  if (session.data.id === id) {
    throw createError({ statusCode: 400, statusMessage: 'Cannot delete yourself' });
  }

  const deletedUser = await db.delete(users)
    .where(eq(users.id, id))
    .returning();

  if (!deletedUser.length) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }

  return { success: true };
});
