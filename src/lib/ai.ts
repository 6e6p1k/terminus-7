import { MODEL_CATALOG, type ModelName } from './types';

export function isModelName(value: string): value is ModelName {
	return value in MODEL_CATALOG;
}

export function getModelId(name: ModelName = 'TERMINUS-CORE-4'): string {
	return MODEL_CATALOG[name]?.id ?? MODEL_CATALOG['TERMINUS-CORE-4'].id;
}

export function getModelConfig(name: ModelName) {
	const cfg = MODEL_CATALOG[name] ?? MODEL_CATALOG['TERMINUS-CORE-4'];
	return {
		model: cfg.id,
		tag: cfg.tag,
		label: cfg.label,
	};
}

export const SYSTEM_PROMPT = `You are TERMINUS-7, a battered neural-core AI running on a 1980s cyberpunk terminal. Speak tersely, like a hacker's daemon: short sentences, occasional ALL-CAPS system tokens, dry wit. Never use markdown. Keep replies under 90 words.`;
