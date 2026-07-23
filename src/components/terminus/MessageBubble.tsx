'use client';

import type { CSSProperties } from 'react';
import type { Message } from '@/lib/types';
import { useChat } from '@/lib/chat-context';

export function MessageBubble({
	msg,
	index,
	compact = false,
}: {
	msg: Message;
	index: number;
	compact?: boolean;
}) {
	const {
		colors: C,
		stagger,
		isMobile,
		feedback,
		copiedId,
		copy,
		regenerate,
		toggleFeedback,
		generating,
	} = useChat();

	const isAI = msg.role === 'assistant';
	const rot = stagger ? (index % 2 === 0 ? -1 : 1) * (0.5 + (index % 3) * (compact ? 0.25 : 0.35)) : 0;
	const push = stagger ? (index % 3) * (compact ? 8 : 22) : 0;
	const accent = isAI ? C.cyan : C.mag;
	const glow = isAI ? C.cyanGlow : C.magGlow;
	const fbOn = !!feedback[msg.id];
	const stamp = (() => {
		const d = new Date(msg.createdAt);
		if (Number.isNaN(d.getTime())) return '--:--';
		return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
	})();

	const wrapStyle: CSSProperties = {
		maxWidth: compact ? '88%' : isMobile ? '92%' : '68%',
		alignSelf: isAI ? 'flex-start' : 'flex-end',
		marginTop: index === 0 ? (compact ? 4 : 10) : stagger ? (compact ? 18 : 22) : 16,
		marginLeft: isAI ? 10 + push : 'auto',
		marginRight: isAI ? 'auto' : 10 + push,
		transform: `rotate(${rot}deg)`,
		animation: 'tm-boot .25s steps(4)',
	};

	const avatarSize = compact ? 34 : 44;
	const avatarStyle: CSSProperties = {
		width: avatarSize,
		height: avatarSize,
		flexShrink: 0,
		background: 'var(--panel)',
		border: `2px solid ${accent}`,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontFamily: 'var(--font-vt323), monospace',
		fontSize: compact ? 14 : 18,
		color: accent,
		boxShadow: `0 0 12px rgba(${glow},0.5)`,
		clipPath: 'polygon(0 0,100% 0,100% 80%,80% 100%,0 100%)',
	};

	const bubbleStyle: CSSProperties = {
		background: 'var(--panel)',
		border: `1px solid ${accent}`,
		borderLeft: isAI ? `4px solid ${accent}` : `1px solid ${accent}`,
		borderRight: isAI ? `1px solid ${accent}` : `4px solid ${accent}`,
		padding: compact ? '11px 13px' : '12px 14px',
		fontSize: 14,
		lineHeight: 1.6,
		color: C.text,
		letterSpacing: 0.4,
		whiteSpace: 'pre-wrap',
		wordBreak: 'break-word',
		boxShadow: `4px 4px 0 rgba(0,0,0,0.6), inset 0 0 18px rgba(${glow},0.08)`,
	};

	const actionStyle: CSSProperties = {
		cursor: 'pointer',
		background: 'var(--bg)',
		color: C.cyan,
		border: `1px solid rgba(${C.cyanGlow},0.5)`,
		fontFamily: "'Share Tech Mono', monospace",
		fontSize: 10,
		padding: '4px 7px',
		letterSpacing: 1,
	};

	return (
		<div style={wrapStyle}>
			<div
				style={{
					display: 'flex',
					gap: compact ? 8 : 10,
					alignItems: 'flex-start',
					flexDirection: isAI ? 'row' : 'row-reverse',
				}}
			>
				<div style={avatarStyle}>{isAI ? 'SYS' : 'USR'}</div>
				<div style={{ flex: 1, minWidth: 0 }}>
					<div
						style={{
							fontFamily: 'var(--font-vt323), monospace',
							fontSize: compact ? 14 : 15,
							letterSpacing: 2,
							marginBottom: 4,
							color: accent,
							textAlign: isAI ? 'left' : 'right',
						}}
					>
						{isAI ? 'TERMINUS·7' : 'OPERATOR_K'}{' '}
						<span style={{ opacity: 0.5, fontSize: 9 }}>{stamp}</span>
					</div>
					<div style={bubbleStyle}>{msg.content || (generating && isAI ? '…' : '')}</div>
					{isAI && (
						<div style={{ display: 'flex', gap: 6, marginTop: compact ? 6 : 8 }}>
							<button type="button" style={actionStyle} onClick={() => copy(msg.id, msg.content)}>
								{copiedId === msg.id ? '✓ OK' : '▤ CPY'}
							</button>
							<button
								type="button"
								style={actionStyle}
								onClick={() => void regenerate(msg.id)}
								disabled={generating}
							>
								↻ RGN
							</button>
							<button
								type="button"
								style={{
									...actionStyle,
									color: fbOn ? 'var(--bg)' : C.mag,
									background: fbOn ? C.mag : 'var(--bg)',
									border: `1px solid ${C.mag}`,
								}}
								onClick={() => toggleFeedback(msg.id)}
							>
								{fbOn ? '◈ ACK' : '◈ FBK'}
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export function TypingIndicator({ compact = false }: { compact?: boolean }) {
	const { colors: C } = useChat();
	return (
		<div
			style={{
				alignSelf: 'flex-start',
				maxWidth: compact ? '80%' : '70%',
				marginTop: compact ? 16 : 18,
				marginLeft: compact ? 6 : 14,
				transform: 'rotate(-0.6deg)',
				animation: 'tm-boot .2s steps(3)',
			}}
		>
			<div style={{ display: 'flex', gap: compact ? 8 : 10, alignItems: 'flex-start' }}>
				<div
					style={{
						width: compact ? 34 : 44,
						height: compact ? 34 : 44,
						flexShrink: 0,
						background: 'var(--panel)',
						border: `2px solid ${C.cyan}`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontFamily: 'var(--font-vt323), monospace',
						fontSize: compact ? 16 : 22,
						color: C.cyan,
						boxShadow: `0 0 12px rgba(${C.cyanGlow},0.5)`,
						clipPath: compact
							? 'polygon(0 0,100% 0,100% 80%,80% 100%,0 100%)'
							: undefined,
					}}
				>
					{compact ? 'SYS' : '◈'}
				</div>
				<div
					style={{
						background: 'var(--panel)',
						border: `1px solid rgba(${C.cyanGlow},0.5)`,
						borderLeft: compact ? `4px solid ${C.cyan}` : undefined,
						padding: compact ? '10px 14px' : '14px 18px',
						boxShadow: `inset 0 0 16px rgba(${C.cyanGlow},0.12)`,
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: compact ? 10 : 12 }}>
						<div
							style={{
								display: 'flex',
								gap: compact ? 3 : 4,
								alignItems: 'flex-end',
								height: compact ? 16 : 20,
							}}
						>
							{[0, 0.15, 0.3, 0.45].slice(0, compact ? 3 : 4).map((delay, i) => (
								<span
									key={i}
									className="tm-load"
									style={{
										width: compact ? 5 : 6,
										height: compact ? 16 : 20,
										background: i === 2 ? C.mag : C.cyan,
										animationDelay: `${delay}s`,
									}}
								/>
							))}
						</div>
						<span
							style={{
								fontFamily: 'var(--font-vt323), monospace',
								fontSize: compact ? 17 : 20,
								color: C.cyan,
								letterSpacing: 2,
							}}
						>
							PROCESSING
							<span
								className="tm-blink"
								style={{
									display: 'inline-block',
									width: compact ? 8 : 10,
									height: compact ? 13 : 16,
									background: C.mag,
									marginLeft: 4,
									verticalAlign: -2,
								}}
							/>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
