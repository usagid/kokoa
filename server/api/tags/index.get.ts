import { db } from '../../utils/db';
import { tags } from '../../database/schema';

export default defineEventHandler(async (event) => {
  return await db.select().from(tags);
});
