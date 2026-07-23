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

/** Codename → real AI Gateway model slug */
export const MODEL_CATALOG = {
	'TERMINUS-CORE-4': {
		id: 'openai/gpt-5.4',
		label: 'gpt-5.4',
		tag: 'flagship · general',
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
		tag: 'edge · cheap & quick',
	},
} as const;

export type ModelName = keyof typeof MODEL_CATALOG;

export const MODEL_NAMES = Object.keys(MODEL_CATALOG) as ModelName[];

export const MODEL_TAGS: Record<ModelName, string> = {
	'TERMINUS-CORE-4': MODEL_CATALOG['TERMINUS-CORE-4'].tag,
	'GHOST-7B': MODEL_CATALOG['GHOST-7B'].tag,
	'BLACKICE-XL': MODEL_CATALOG['BLACKICE-XL'].tag,
	'ORACLE-13B': MODEL_CATALOG['ORACLE-13B'].tag,
	'DAEMON-MINI': MODEL_CATALOG['DAEMON-MINI'].tag,
};

export const MODEL_IDS: Record<ModelName, string> = {
	'TERMINUS-CORE-4': MODEL_CATALOG['TERMINUS-CORE-4'].id,
	'GHOST-7B': MODEL_CATALOG['GHOST-7B'].id,
	'BLACKICE-XL': MODEL_CATALOG['BLACKICE-XL'].id,
	'ORACLE-13B': MODEL_CATALOG['ORACLE-13B'].id,
	'DAEMON-MINI': MODEL_CATALOG['DAEMON-MINI'].id,
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
