import { streamText } from 'ai';
import { desc, eq, and } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { chats, messages } from '@/lib/db/schema';
import { getModelConfig, isModelName, SYSTEM_PROMPT } from '@/lib/ai';
import type { ModelName } from '@/lib/types';

export const runtime = 'nodejs';

function resolveModel(value: string): ModelName {
	return isModelName(value) ? value : 'TERMINUS-CORE-4';
}

export async function GET() {
	try {
		const db = getDb();
		const allChats = await db.select().from(chats).orderBy(desc(chats.updatedAt));
		return Response.json(allChats);
	} catch (err) {
		console.error('GET /api/chat failed:', err);
		return Response.json(
			{ error: err instanceof Error ? err.message : 'Database unavailable' },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as {
			chatId?: string;
			message: string;
			model: string;
			regenerate?: boolean;
		};

		const { chatId, message, regenerate } = body;
		const modelName = resolveModel(body.model ?? 'TERMINUS-CORE-4');

		if (!message?.trim()) {
			return Response.json({ error: 'Empty message' }, { status: 400 });
		}

		const db = getDb();
		const activeChatId = chatId || crypto.randomUUID();

		const existing = await db.select().from(chats).where(eq(chats.id, activeChatId));
		if (existing.length === 0) {
			const title = message.slice(0, 60).replace(/\n/g, ' ') || 'UNTITLED_SESSION';
			await db.insert(chats).values({
				id: activeChatId,
				title,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}

		if (regenerate) {
			const historyRows = await db
				.select()
				.from(messages)
				.where(eq(messages.chatId, activeChatId))
				.orderBy(desc(messages.createdAt));

			const last = historyRows[0];
			if (last?.role === 'assistant') {
				await db
					.delete(messages)
					.where(and(eq(messages.id, last.id), eq(messages.chatId, activeChatId)));
			}
		} else {
			await db.insert(messages).values({
				id: crypto.randomUUID(),
				chatId: activeChatId,
				role: 'user',
				content: message,
				createdAt: new Date(),
			});
		}

		const msgCount = await db.select().from(messages).where(eq(messages.chatId, activeChatId));
		if (!regenerate && msgCount.length <= 1) {
			await db
				.update(chats)
				.set({
					updatedAt: new Date(),
					title: message.slice(0, 60).replace(/\n/g, ' ') || 'UNTITLED_SESSION',
				})
				.where(eq(chats.id, activeChatId));
		} else {
			await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, activeChatId));
		}

		const history = await db
			.select()
			.from(messages)
			.where(eq(messages.chatId, activeChatId))
			.orderBy(messages.createdAt);

		const historyForLLM = history.map((m) => ({
			role: m.role as 'user' | 'assistant',
			content: m.content,
		}));

		const { model: modelId } = getModelConfig(modelName);

		const result = streamText({
			model: modelId,
			system: SYSTEM_PROMPT,
			messages: historyForLLM,
			onFinish: async ({ text }) => {
				try {
					await db.insert(messages).values({
						id: crypto.randomUUID(),
						chatId: activeChatId,
						role: 'assistant',
						content: text,
						createdAt: new Date(),
					});
				} catch (err) {
					console.error('Failed to persist assistant message:', err);
				}
			},
		});

		return result.toTextStreamResponse({
			headers: {
				'X-Chat-Id': activeChatId,
				'X-Model-Id': modelId,
			},
		});
	} catch (err) {
		console.error('POST /api/chat failed:', err);
		return Response.json(
			{ error: err instanceof Error ? err.message : 'Chat uplink failed' },
			{ status: 500 },
		);
	}
}
