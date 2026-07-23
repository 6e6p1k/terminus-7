'use client';

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from 'react';
import type { Chat, ColorScheme, Message, ModelName } from '@/lib/types';
import { MODEL_CATALOG } from '@/lib/types';
import { SCHEME_MAP } from '@/lib/schemes';

type ChatContextValue = {
	chats: Chat[];
	messages: Message[];
	activeChatId: string | null;
	input: string;
	setInput: (v: string) => void;
	generating: boolean;
	currentModel: ModelName;
	setCurrentModel: (m: ModelName) => void;
	modelOpen: boolean;
	setModelOpen: (v: boolean) => void;
	scheme: ColorScheme;
	setScheme: (s: ColorScheme) => void;
	scanlines: boolean;
	setScanlines: (v: boolean) => void;
	stagger: boolean;
	setStagger: (v: boolean) => void;
	sidebarOpen: boolean;
	setSidebarOpen: (v: boolean) => void;
	collapsed: boolean;
	setCollapsed: (v: boolean) => void;
	isMobile: boolean;
	settingsOpen: boolean;
	setSettingsOpen: (v: boolean) => void;
	clock: string;
	temp: number;
	feedback: Record<string, boolean>;
	copiedId: string | null;
	attachHint: string;
	colors: (typeof SCHEME_MAP)[ColorScheme];
	activeChat: Chat | undefined;
	currentModelMeta: (typeof MODEL_CATALOG)[ModelName];
	loadChats: () => Promise<void>;
	selectChat: (id: string) => Promise<void>;
	newChat: () => void;
	send: (opts?: { text?: string; regenerate?: boolean }) => Promise<void>;
	stop: () => void;
	attach: () => void;
	copy: (id: string, text: string) => void;
	toggleFeedback: (id: string) => void;
	regenerate: (msgId: string) => Promise<void>;
};

const ChatContext = createContext<ChatContextValue | null>(null);

function pad(n: number) {
	return String(n).padStart(2, '0');
}

export function ChatProvider({ children }: { children: ReactNode }) {
	const [chats, setChats] = useState<Chat[]>([]);
	const [messages, setMessages] = useState<Message[]>([]);
	const [activeChatId, setActiveChatId] = useState<string | null>(null);
	const [input, setInput] = useState('');
	const [generating, setGenerating] = useState(false);
	const [currentModel, setCurrentModel] = useState<ModelName>('TERMINUS-CORE-4');
	const [modelOpen, setModelOpen] = useState(false);
	const [scheme, setScheme] = useState<ColorScheme>('CYAN / MAGENTA');
	const [scanlines, setScanlines] = useState(true);
	const [stagger, setStagger] = useState(true);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [clock, setClock] = useState('00:00:00');
	const [temp, setTemp] = useState(41);
	const [feedback, setFeedback] = useState<Record<string, boolean>>({});
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const [attachHint, setAttachHint] = useState('');
	const abortRef = useRef<AbortController | null>(null);

	useEffect(() => {
		function onResize() {
			const m = window.innerWidth < 900;
			setIsMobile((prev) => {
				if (prev !== m) setSidebarOpen(false);
				return m;
			});
		}
		onResize();
		window.addEventListener('resize', onResize);
		const timer = setInterval(() => {
			const d = new Date();
			setClock(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
			setTemp(40 + Math.floor(Math.random() * 6));
		}, 1000);
		return () => {
			window.removeEventListener('resize', onResize);
			clearInterval(timer);
		};
	}, []);

	const loadChats = useCallback(async () => {
		try {
			const res = await fetch('/api/chat');
			if (res.ok) {
				const data = await res.json();
				if (Array.isArray(data)) setChats(data);
			}
		} catch {
			/* offline / no db */
		}
	}, []);

	useEffect(() => {
		void loadChats();
	}, [loadChats]);

	const selectChat = useCallback(async (id: string) => {
		setActiveChatId(id);
		setSidebarOpen(false);
		const res = await fetch(`/api/chat/${id}`);
		if (res.ok) {
			setMessages(await res.json());
		}
	}, []);

	const newChat = useCallback(() => {
		setActiveChatId(null);
		setMessages([]);
		setInput('');
		setSidebarOpen(false);
		setAttachHint('');
	}, []);

	const stop = useCallback(() => {
		abortRef.current?.abort();
		abortRef.current = null;
		setGenerating(false);
	}, []);

	const attach = useCallback(() => {
		setAttachHint('FILE_UPLOAD // no carrier — attach subsystem offline.');
	}, []);

	const copy = useCallback((id: string, text: string) => {
		try {
			void navigator.clipboard?.writeText(text);
			setCopiedId(id);
			setTimeout(() => setCopiedId(null), 1200);
		} catch {
			/* ignore */
		}
	}, []);

	const toggleFeedback = useCallback((id: string) => {
		setFeedback((f) => ({ ...f, [id]: !f[id] }));
	}, []);

	const send = useCallback(
		async (opts?: { text?: string; regenerate?: boolean }) => {
			const text = (opts?.text ?? input).trim();
			const regenerate = opts?.regenerate === true;
			if (!text || generating) return;

			if (!regenerate) {
				const userMsg: Message = {
					id: crypto.randomUUID(),
					chatId: activeChatId ?? 'pending',
					role: 'user',
					content: text,
					createdAt: new Date(),
				};
				setMessages((m) => [...m, userMsg]);
				setInput('');
				setAttachHint('');
			}

			setGenerating(true);
			abortRef.current = new AbortController();

			try {
				const res = await fetch('/api/chat', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						chatId: activeChatId,
						message: text,
						model: currentModel,
						regenerate,
					}),
					signal: abortRef.current.signal,
				});

				const newChatId = res.headers.get('X-Chat-Id');
				if (newChatId && !activeChatId) {
					setActiveChatId(newChatId);
				}

				if (!res.ok || !res.body) {
					const errText = await res.text().catch(() => '');
					setMessages((m) => [
						...m,
						{
							id: crypto.randomUUID(),
							chatId: activeChatId ?? newChatId ?? '',
							role: 'assistant',
							content: `SYS_ERR :: uplink failed (${res.status}). ${errText.slice(0, 240) || 'Check DATABASE_URL and AI Gateway auth (AI_GATEWAY_API_KEY or VERCEL_OIDC_TOKEN).'}`,
							createdAt: new Date(),
						},
					]);
					return;
				}

				const reader = res.body.getReader();
				const decoder = new TextDecoder();
				let assistantContent = '';
				const assistantId = crypto.randomUUID();
				setMessages((m) => [
					...m,
					{
						id: assistantId,
						chatId: activeChatId ?? newChatId ?? '',
						role: 'assistant',
						content: '',
						createdAt: new Date(),
					},
				]);

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					assistantContent += decoder.decode(value, { stream: true });
					const snapshot = assistantContent;
					setMessages((m) =>
						m.map((msg) => (msg.id === assistantId ? { ...msg, content: snapshot } : msg)),
					);
				}

				await loadChats();
			} catch (err) {
				if ((err as Error).name !== 'AbortError') {
					setMessages((m) => [
						...m,
						{
							id: crypto.randomUUID(),
							chatId: activeChatId ?? '',
							role: 'assistant',
							content: 'SYS_ERR :: stream interrupted. Mesh link dropped.',
							createdAt: new Date(),
						},
					]);
				}
			} finally {
				setGenerating(false);
				abortRef.current = null;
			}
		},
		[activeChatId, currentModel, generating, input, loadChats],
	);

	const regenerate = useCallback(
		async (msgId: string) => {
			const idx = messages.findIndex((m) => m.id === msgId);
			if (idx < 0 || generating) return;
			const prior = messages.slice(0, idx);
			const lastUser = [...prior].reverse().find((m) => m.role === 'user');
			if (!lastUser) return;
			setMessages(prior);
			await send({ text: lastUser.content, regenerate: true });
		},
		[generating, messages, send],
	);

	const value = useMemo<ChatContextValue>(
		() => ({
			chats,
			messages,
			activeChatId,
			input,
			setInput,
			generating,
			currentModel,
			setCurrentModel,
			modelOpen,
			setModelOpen,
			scheme,
			setScheme,
			scanlines,
			setScanlines,
			stagger,
			setStagger,
			sidebarOpen,
			setSidebarOpen,
			collapsed,
			setCollapsed,
			isMobile,
			settingsOpen,
			setSettingsOpen,
			clock,
			temp,
			feedback,
			copiedId,
			attachHint,
			colors: SCHEME_MAP[scheme],
			activeChat: chats.find((c) => c.id === activeChatId),
			currentModelMeta: MODEL_CATALOG[currentModel],
			loadChats,
			selectChat,
			newChat,
			send,
			stop,
			attach,
			copy,
			toggleFeedback,
			regenerate,
		}),
		[
			chats,
			messages,
			activeChatId,
			input,
			generating,
			currentModel,
			modelOpen,
			scheme,
			scanlines,
			stagger,
			sidebarOpen,
			collapsed,
			isMobile,
			settingsOpen,
			clock,
			temp,
			feedback,
			copiedId,
			attachHint,
			loadChats,
			selectChat,
			newChat,
			send,
			stop,
			attach,
			copy,
			toggleFeedback,
			regenerate,
		],
	);

	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
	const ctx = useContext(ChatContext);
	if (!ctx) throw new Error('useChat must be used within ChatProvider');
	return ctx;
}
