import { json } from '@sveltejs/kit';
import { streamText } from 'ai';
import { db } from '$lib/server/db';
import { chats, messages } from '$lib/server/db/schema';
import { getModelConfig, type ModelName } from '$lib/server/ai';
import { eq, desc } from 'drizzle-orm';
import type { RequestHandler } from './$types';

const SYSTEM_PROMPT = `You are TERMINUS-7, a battered neural-core AI running on a 1980s cyberpunk terminal. Speak tersely, like a hacker's daemon: short sentences, occasional ALL-CAPS system tokens, dry wit. Never use markdown. Keep replies under 90 words.`;

export const GET: RequestHandler = async () => {
	const allChats = await db.select().from(chats).orderBy(desc(chats.updatedAt));
	return json(allChats);
};

export const POST: RequestHandler = async ({ request }) => {
	const { chatId, message, model } = await request.json() as {
		chatId?: string;
		message: string;
		model: ModelName;
	};

	if (!message?.trim()) return json({ error: 'Empty message' }, { status: 400 });

	// generate chat ID if new chat
	const activeChatId = chatId || crypto.randomUUID();

	// ensure chat exists
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

	// save user message
	const userMsgId = crypto.randomUUID();
	await db.insert(messages).values({
		id: userMsgId,
		chatId: activeChatId,
		role: 'user',
		content: message,
		createdAt: new Date(),
	});

	// update chat timestamp + title (first 3 msgs only)
	const msgCount = await db.select().from(messages).where(eq(messages.chatId, activeChatId));
	if (msgCount.length <= 1) {
		await db.update(chats).set({ updatedAt: new Date(), title: message.slice(0, 60).replace(/\n/g, ' ') || 'UNTITLED_SESSION' }).where(eq(chats.id, activeChatId));
	} else {
		await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, activeChatId));
	}

	// fetch history for context
	const history = await db
		.select()
		.from(messages)
		.where(eq(messages.chatId, activeChatId))
		.orderBy(messages.createdAt);

	const historyForLLM = history.map((m) => ({
		role: m.role as 'user' | 'assistant',
		content: m.content,
	}));

	const { model: aiModel } = getModelConfig(model || 'TERMINUS-CORE-4');

	const result = streamText({
		model: aiModel,
		system: SYSTEM_PROMPT,
		messages: historyForLLM,
		onFinish: async ({ text }) => {
			await db.insert(messages).values({
				id: crypto.randomUUID(),
				chatId: activeChatId,
				role: 'assistant',
				content: text,
				createdAt: new Date(),
			});
		},
	});

	// AI SDK v6+ removed toDataStreamResponse — plain text stream matches our custom client
	return result.toTextStreamResponse({
		headers: { 'X-Chat-Id': activeChatId },
	});
};
