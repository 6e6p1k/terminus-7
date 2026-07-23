import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
	if (!_db) {
		const url = env.DATABASE_URL;
		if (!url || url.includes('user:password@host:port')) {
			throw new Error('DATABASE_URL is not configured. Set it in your .env file or Vercel project settings.');
		}
		const client = neon(url);
		_db = drizzle(client, { schema });
	}
	return _db;
}

// convenience accessor that throws only when actually used
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
	get(_, prop) {
		return (getDb() as any)[prop];
	},
});
