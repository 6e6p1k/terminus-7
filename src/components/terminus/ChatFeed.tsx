'use client';

import { useEffect, useRef } from 'react';
import { useChat } from '@/lib/chat-context';
import { MessageBubble, TypingIndicator } from './MessageBubble';

export function ChatFeed({ compact = false }: { compact?: boolean }) {
	const { messages, generating, isMobile } = useChat();
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		requestAnimationFrame(() => {
			el.scrollTop = el.scrollHeight;
		});
	}, [messages, generating]);

	return (
		<div
			ref={ref}
			style={{
				flex: 1,
				overflowY: 'auto',
				padding: compact ? '12px 10px 14px' : isMobile ? '6px 8px' : '6px 20px',
				position: 'relative',
			}}
		>
			<div
				style={{
					maxWidth: compact ? undefined : 960,
					margin: '0 auto',
					display: 'flex',
					flexDirection: 'column',
					padding: compact ? 0 : '8px 4px 40px',
					minHeight: '100%',
				}}
			>
				{messages.length === 0 && !generating && (
					<div
						style={{
							margin: 'auto',
							textAlign: 'center',
							opacity: 0.45,
							letterSpacing: 2,
							fontSize: 12,
							padding: 24,
						}}
					>
						AWAITING DIRECTIVE // NEURAL CORE IDLE
					</div>
				)}
				{messages.map((msg, i) => (
					<MessageBubble key={msg.id} msg={msg} index={i} compact={compact} />
				))}
				{generating && messages[messages.length - 1]?.role !== 'assistant' && (
					<TypingIndicator compact={compact} />
				)}
				{generating &&
					messages[messages.length - 1]?.role === 'assistant' &&
					!messages[messages.length - 1]?.content && <TypingIndicator compact={compact} />}
			</div>
		</div>
	);
}
