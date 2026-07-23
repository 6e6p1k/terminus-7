import { eq, asc } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { messages } from '@/lib/db/schema';

export const runtime = 'nodejs';

export async function GET(
	_request: Request,
	context: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await context.params;
		const db = getDb();
		const rows = await db
			.select()
			.from(messages)
			.where(eq(messages.chatId, id))
			.orderBy(asc(messages.createdAt));
		return Response.json(rows);
	} catch (err) {
		console.error('GET /api/chat/[id] failed:', err);
		return Response.json(
			{ error: err instanceof Error ? err.message : 'Database unavailable' },
			{ status: 500 },
		);
	}
}
