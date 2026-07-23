import { createOpenAI } from '@ai-sdk/openai';
import { env } from '$env/dynamic/private';

export const aiGateway = createOpenAI({
	baseURL: 'https://ai-gateway.vercel.sh/api/v1',
	apiKey: env.AI_GATEWAY_API_KEY,
});

export const MODELS = {
	'TERMINUS-CORE-4': { model: 'gpt-4o', tag: 'flagship · 200K ctx' },
	'GHOST-7B': { model: 'gpt-4o-mini', tag: 'fast · low latency' },
	'BLACKICE-XL': { model: 'gpt-4.1', tag: 'deep reasoning' },
	'ORACLE-13B': { model: 'claude-3-5-sonnet-latest', tag: 'balanced daily driver' },
	'DAEMON-MINI': { model: 'gpt-4o-mini', tag: 'edge · runs offline' },
} as const;

export type ModelName = keyof typeof MODELS;

export function getModelConfig(name: ModelName) {
	const cfg = MODELS[name];
	return {
		model: aiGateway(cfg.model),
		tag: cfg.tag,
	};
}
