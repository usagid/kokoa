import { db } from '../../utils/db';
import { settings } from '../../database/schema';

export default defineEventHandler(async (event) => {
  const data = await db.select().from(settings);
  const result = data.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {} as Record<string, string>);

  // Default values
  if (!result.blogTitle) result.blogTitle = 'My Personal Blog';
  if (!result.footerMessage) result.footerMessage = 'Powered by Kokoa UI';

  return result;
});
