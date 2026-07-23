export interface Chat {
	id: string;
	title: string;
	createdAt: string | Date;
	updatedAt: string | Date;
	preview?: string;
}

export interface Message {
	id: string;
	chatId: string;
	role: 'user' | 'assistant';
	content: string;
	createdAt: string | Date;
}

export const MODEL_CATALOG = {
	'TERMINUS-CORE-4': {
		id: 'openai/gpt-5.4',
		label: 'gpt-5.4',
		tag: 'flagship · 200K ctx',
	},
	'GHOST-7B': {
		id: 'openai/gpt-5.4-mini',
		label: 'gpt-5.4-mini',
		tag: 'fast · low latency',
	},
	'BLACKICE-XL': {
		id: 'anthropic/claude-opus-4.6',
		label: 'claude-opus-4.6',
		tag: 'deep reasoning',
	},
	'ORACLE-13B': {
		id: 'anthropic/claude-sonnet-4.6',
		label: 'claude-sonnet-4.6',
		tag: 'balanced daily driver',
	},
	'DAEMON-MINI': {
		id: 'openai/gpt-5.4-nano',
		label: 'gpt-5.4-nano',
		tag: 'edge · runs offline',
	},
} as const;

export type ModelName = keyof typeof MODEL_CATALOG;
export const MODEL_NAMES = Object.keys(MODEL_CATALOG) as ModelName[];

export const COLOR_SCHEMES = [
	'CYAN / MAGENTA',
	'ACID / TOXIC GREEN',
	'AMBER / CRT ORANGE',
	'ICE / ARCTIC BLUE',
	'BLOOD / INFRARED',
	'VAPOR / SUNSET',
	'PAPER / DAYLIGHT',
] as const;

export type ColorScheme = (typeof COLOR_SCHEMES)[number];

export interface SchemeColors {
	cyan: string;
	mag: string;
	text: string;
	cyanGlow: string;
	magGlow: string;
	bg: string;
	panel: string;
	dim: string;
}
