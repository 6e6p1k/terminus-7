import type { Chat, Message, ModelName, ColorScheme, SchemeColors } from '$lib/types';

// ── color scheme definitions ──
export const SCHEME_MAP: Record<ColorScheme, SchemeColors> = {
	'CYAN / MAGENTA': { cyan: '#22e6ff', mag: '#ff37c7', text: '#d7fbff', cyanGlow: '34,230,255', magGlow: '255,55,199' },
	'ACID / TOXIC GREEN': { cyan: '#39ff9e', mag: '#c6ff2e', text: '#daffe4', cyanGlow: '57,255,158', magGlow: '198,255,46' },
	'AMBER / CRT ORANGE': { cyan: '#ffb728', mag: '#ff5e2e', text: '#ffe9c7', cyanGlow: '255,183,40', magGlow: '255,94,46' },
	'ICE / ARCTIC BLUE': { cyan: '#7fd4ff', mag: '#4f7bff', text: '#dcefff', cyanGlow: '127,212,255', magGlow: '79,123,255' },
	'BLOOD / INFRARED': { cyan: '#ff2e55', mag: '#ff8c2e', text: '#ffd7d7', cyanGlow: '255,46,85', magGlow: '255,140,46' },
	'VAPOR / SUNSET': { cyan: '#ff6ad5', mag: '#c774f0', text: '#ffe0f5', cyanGlow: '255,106,213', magGlow: '199,116,240' },
};

// ── reactive app state (Svelte 5 runes) ──
class ChatStore {
	// core state
	chats = $state<Chat[]>([]);
	messages = $state<Message[]>([]);
	activeChatId = $state<string | null>(null);
	input = $state('');
	generating = $state(false);
	currentModel = $state<ModelName>('TERMINUS-CORE-4');
	modelOpen = $state(false);

	// UI state
	scheme = $state<ColorScheme>('CYAN / MAGENTA');
	scanlines = $state(true);
	stagger = $state(true);
	sidebarOpen = $state(false);
	collapsed = $state(false);
	isMobile = $state(false);
	settingsOpen = $state(false);
	clock = $state('00:00:00');
	temp = $state(41);

	// feedback toggles
	feedback = $state<Record<string, boolean>>({});

	// abort controller for stopping generation
	abortController: AbortController | null = null;

	// ── derived ──
	get colors(): SchemeColors {
		return SCHEME_MAP[this.scheme];
	}

	get activeChat(): Chat | undefined {
		return this.chats.find((c) => c.id === this.activeChatId);
	}

	// ── actions ──

	async loadChats() {
		const res = await fetch('/api/chat');
		if (res.ok) {
			this.chats = await res.json();
		}
	}

	async selectChat(id: string) {
		this.activeChatId = id;
		this.sidebarOpen = false;
		const res = await fetch(`/api/chat/${id}`);
		if (res.ok) {
			this.messages = await res.json();
		}
	}

	async newChat() {
		this.activeChatId = null;
		this.messages = [];
		this.input = '';
		this.sidebarOpen = false;
	}

	async send() {
		const text = this.input.trim();
		if (!text || this.generating) return;

		const userMsg: Message = {
			id: crypto.randomUUID(),
			chatId: this.activeChatId ?? 'pending',
			role: 'user',
			content: text,
			createdAt: new Date(),
		};

		this.messages = [...this.messages, userMsg];
		this.input = '';
		this.generating = true;

		this.abortController = new AbortController();

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					chatId: this.activeChatId,
					message: text,
					model: this.currentModel,
				}),
				signal: this.abortController.signal,
			});

			const newChatId = res.headers.get('X-Chat-Id');
			if (newChatId && !this.activeChatId) {
				this.activeChatId = newChatId;
			}

			if (!res.ok || !res.body) {
				const errText = await res.text().catch(() => '');
				this.messages = [
					...this.messages,
					{
						id: crypto.randomUUID(),
						chatId: this.activeChatId ?? newChatId ?? '',
						role: 'assistant',
						content: `SYS_ERR :: uplink failed (${res.status}). ${errText.slice(0, 200) || 'Check DATABASE_URL and AI_GATEWAY_API_KEY.'}`,
						createdAt: new Date(),
					},
				];
				this.generating = false;
				return;
			}

			// stream plain text from toTextStreamResponse
			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let assistantContent = '';

			// add placeholder assistant message
			const assistantId = crypto.randomUUID();
			const assistantMsg: Message = {
				id: assistantId,
				chatId: this.activeChatId ?? newChatId ?? '',
				role: 'assistant',
				content: '',
				createdAt: new Date(),
			};
			this.messages = [...this.messages, assistantMsg];

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				assistantContent += decoder.decode(value, { stream: true });
				this.messages = this.messages.map((m) =>
					m.id === assistantId ? { ...m, content: assistantContent } : m
				);
			}
		} catch (err) {
			if ((err as Error).name !== 'AbortError') {
				console.error('Chat error:', err);
			}
		} finally {
			this.generating = false;
			this.abortController = null;
			await this.loadChats();
		}
	}

	stop() {
		this.abortController?.abort();
		this.generating = false;
	}

	toggleFeedback(msgId: string) {
		this.feedback = { ...this.feedback, [msgId]: !this.feedback[msgId] };
	}

	async copyText(text: string) {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			// fallback
		}
	}

	tick() {
		const d = new Date();
		const p = (n: number) => String(n).padStart(2, '0');
		this.clock = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
		this.temp = 40 + Math.floor(Math.random() * 6);
	}
}

export const store = new ChatStore();
