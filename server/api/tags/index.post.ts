import { db } from '../../utils/db';
import { tags } from '../../database/schema';
import { randomUUID } from 'node:crypto';

export default defineEventHandler(async (event) => {
  const session = await useSession(event, {
    password: process.env.SESSION_PASSWORD || 'your-super-secret-password-that-is-at-least-32-characters-long'
  });
  if (!session.data.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  if (!body.name) {
    throw createError({ statusCode: 400, statusMessage: 'Name is required' });
  }

  const id = randomUUID();
  await db.insert(tags).values({
    id,
    name: body.name
  });

  return { id, name: body.name };
});
