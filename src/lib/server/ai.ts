import { MODEL_CATALOG, type ModelName } from '$lib/types';

export type { ModelName };

export const MODELS = MODEL_CATALOG;

export function isModelName(value: string): value is ModelName {
	return value in MODEL_CATALOG;
}

/** Resolve codename → AI Gateway `provider/model` string (auto-routed by AI SDK). */
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
