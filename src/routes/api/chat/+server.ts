import { json } from '@sveltejs/kit';
import { streamText } from 'ai';
import { db } from '$lib/server/db';
import { chats, messages } from '$lib/server/db/schema';
import { getModelConfig, isModelName, type ModelName } from '$lib/server/ai';
import { eq, desc, and } from 'drizzle-orm';
import type { RequestHandler } from './$types';

const SYSTEM_PROMPT = `You are TERMINUS-7, a battered neural-core AI running on a 1980s cyberpunk terminal. Speak tersely, like a hacker's daemon: short sentences, occasional ALL-CAPS system tokens, dry wit. Never use markdown. Keep replies under 90 words.`;

export const GET: RequestHandler = async () => {
	try {
		const allChats = await db.select().from(chats).orderBy(desc(chats.updatedAt));
		return json(allChats);
	} catch (err) {
		console.error('GET /api/chat failed:', err);
		return json(
			{ error: err instanceof Error ? err.message : 'Database unavailable' },
			{ status: 500 }
		);
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = (await request.json()) as {
			chatId?: string;
			message: string;
			model: ModelName;
			regenerate?: boolean;
		};

		const { chatId, message, regenerate } = body;
		const modelName: ModelName = isModelName(body.model) ? body.model : 'TERMINUS-CORE-4';

		if (!message?.trim()) return json({ error: 'Empty message' }, { status: 400 });

		const activeChatId = chatId || crypto.randomUUID();

		const existing = await db.select().from(chats).where(eq(chats.id, activeChatId));
		if (existing.length === 0) {
			const title = message.slice(0, 60).replace(/\n/g, ' ');
			await db.insert(chats).values({
				id: activeChatId,
				title: title || 'UNTITLED_SESSION',
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}

		if (regenerate) {
			// drop trailing assistant reply so we can re-roll it
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
		return json(
			{ error: err instanceof Error ? err.message : 'Chat uplink failed' },
			{ status: 500 }
		);
	}
};
