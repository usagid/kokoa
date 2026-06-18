import { db } from '../../utils/db';
import { emoticons } from '../../database/schema';
import crypto from 'node:crypto';

export default defineEventHandler(async (event) => {
  const session = await useSession(event, {
    password: process.env.SESSION_PASSWORD || 'your-super-secret-password-that-is-at-least-32-characters-long'
  });
  if (!session.data.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  const { name, imageUrl } = body;
  
  if (!name || !imageUrl) {
    throw createError({ statusCode: 400, statusMessage: 'Missing fields' });
  }

  const newEmoticon = await db.insert(emoticons).values({
    id: crypto.randomUUID(),
    name,
    imageUrl
  }).returning();

  return newEmoticon[0];
});
