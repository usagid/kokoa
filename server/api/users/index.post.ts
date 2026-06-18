import { db } from '../../utils/db';
import { users } from '../../database/schema';
import crypto from 'node:crypto';
import { hashPassword } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const session = await useSession(event, {
    password: process.env.SESSION_PASSWORD || 'your-super-secret-password-that-is-at-least-32-characters-long'
  });
  if (!session.data.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  const { username, password } = body;
  
  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Missing fields' });
  }

  const passwordHash = await hashPassword(password);

  const newUser = await db.insert(users).values({
    id: crypto.randomUUID(),
    username,
    passwordHash
  }).returning();

  return { id: newUser[0].id, username: newUser[0].username };
});
