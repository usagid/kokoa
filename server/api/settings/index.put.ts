import { db } from '../../utils/db';
import { settings } from '../../database/schema';

export default defineEventHandler(async (event) => {
  const session = await useSession(event, {
    password: process.env.SESSION_PASSWORD || 'your-super-secret-password-that-is-at-least-32-characters-long'
  });
  if (!session.data.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  
  // body is an object of key-value pairs
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string') {
      await db.insert(settings)
        .values({ key, value })
        .onConflictDoUpdate({ target: settings.key, set: { value } });
    }
  }

  return { success: true };
});
