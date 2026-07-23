import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const chats = pgTable('chats', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const messages = pgTable('messages', {
	id: text('id').primaryKey(),
	chatId: text('chat_id')
		.notNull()
		.references(() => chats.id, { onDelete: 'cascade' }),
	role: text('role', { enum: ['user', 'assistant'] }).notNull(),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});
