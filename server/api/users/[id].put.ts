import { db } from '../../utils/db';
import { users } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const session = await useSession(event, { password: process.env.SESSION_PASSWORD || 'your-super-secret-password-that-is-at-least-32-characters-long' });
  if (!session.data.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });

  const id = getRouterParam(event, 'id');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' });

  const body = await readBody(event);
  const { username, password } = body;
  
  if (!username) {
    throw createError({ statusCode: 400, statusMessage: 'Missing username' });
  }

  const updateData: any = { username };
  if (password) {
    updateData.passwordHash = await hashPassword(password);
  }

  const updated = await db.update(users)
    .set(updateData)
    .where(eq(users.id, id))
    .returning();

  if (!updated.length) throw createError({ statusCode: 404, statusMessage: 'Not found' });

  return { id: updated[0].id, username: updated[0].username };
});
