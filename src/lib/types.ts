export interface Chat {
	id: string;
	title: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Message {
	id: string;
	chatId: string;
	role: 'user' | 'assistant';
	content: string;
	createdAt: Date;
}

export const MODEL_NAMES = [
	'TERMINUS-CORE-4',
	'GHOST-7B',
	'BLACKICE-XL',
	'ORACLE-13B',
	'DAEMON-MINI',
] as const;

export type ModelName = (typeof MODEL_NAMES)[number];

export const MODEL_TAGS: Record<ModelName, string> = {
	'TERMINUS-CORE-4': 'flagship · 200K ctx',
	'GHOST-7B': 'fast · low latency',
	'BLACKICE-XL': 'deep reasoning',
	'ORACLE-13B': 'balanced daily driver',
	'DAEMON-MINI': 'edge · runs offline',
};

export const COLOR_SCHEMES = [
	'CYAN / MAGENTA',
	'ACID / TOXIC GREEN',
	'AMBER / CRT ORANGE',
	'ICE / ARCTIC BLUE',
	'BLOOD / INFRARED',
	'VAPOR / SUNSET',
] as const;

export type ColorScheme = (typeof COLOR_SCHEMES)[number];

export interface SchemeColors {
	cyan: string;
	mag: string;
	text: string;
	cyanGlow: string;
	magGlow: string;
}
