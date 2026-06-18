import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import * as schema from '../database/schema';
import fs from 'node:fs';
import path from 'node:path';

const dataDir = process.env.DATABASE_DIR || './.data/pglite';

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const client = new PGlite(dataDir);

export const db = drizzle(client, { schema });
export { client };
