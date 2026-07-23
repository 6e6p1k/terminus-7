'use client';

import { useChat } from '@/lib/chat-context';

export function Atmosphere({ scoped = false }: { scoped?: boolean }) {
	const { scanlines, colors } = useChat();
	const pos = scoped ? ('absolute' as const) : ('fixed' as const);
	if (!scanlines) return null;
	return (
		<>
			<div
				aria-hidden
				style={{
					position: pos,
					inset: 0,
					pointerEvents: 'none',
					zIndex: 900,
					background:
						'repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.28) 3px, rgba(0,0,0,0) 4px)',
					mixBlendMode: 'multiply',
				}}
			/>
			<div
				aria-hidden
				style={{
					position: pos,
					inset: 0,
					pointerEvents: 'none',
					zIndex: 901,
					background:
						'radial-gradient(120% 120% at 50% 40%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.65) 100%)',
				}}
			/>
			<div
				aria-hidden
				className="tm-scan"
				style={{
					position: pos,
					left: 0,
					right: 0,
					top: 0,
					height: 60,
					pointerEvents: 'none',
					zIndex: 902,
					background: `linear-gradient(180deg, rgba(${colors.cyanGlow},0.10), rgba(${colors.cyanGlow},0))`,
				}}
			/>
		</>
	);
}
