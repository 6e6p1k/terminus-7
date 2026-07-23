'use client';

import { COLOR_SCHEMES } from '@/lib/types';
import { useChat } from '@/lib/chat-context';

export function SettingsPanel() {
	const {
		settingsOpen,
		setSettingsOpen,
		scheme,
		setScheme,
		scanlines,
		setScanlines,
		stagger,
		setStagger,
		colors: C,
	} = useChat();

	if (!settingsOpen) return null;

	return (
		<>
			<div
				onClick={() => setSettingsOpen(false)}
				style={{
					position: 'fixed',
					inset: 0,
					zIndex: 100,
					background: 'rgba(0,0,0,0.55)',
				}}
			/>
			<div
				style={{
					position: 'fixed',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					zIndex: 101,
					width: 'min(420px, calc(92vw - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)))',
					maxHeight:
						'min(90dvh, calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 24px))',
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden',
					background: C.panel,
					border: `2px solid ${C.cyan}`,
					boxShadow: `0 0 0 2px ${C.bg}, 10px 10px 0 rgba(${C.magGlow},0.45)`,
					clipPath: 'polygon(0 0,100% 0,100% 94%,96% 100%,0 100%)',
					animation: 'tm-boot .16s steps(3)',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '10px 14px',
						background: C.cyan,
						color: C.bg,
						fontFamily: 'var(--font-vt323), monospace',
						fontSize: 20,
						letterSpacing: 2,
						flexShrink: 0,
					}}
				>
					<span>◤ SYS_CONFIG</span>
					<button
						type="button"
						title="CLOSE"
						onClick={() => setSettingsOpen(false)}
						style={{
							background: 'none',
							border: 'none',
							cursor: 'pointer',
							fontSize: 22,
							color: C.bg,
							width: 44,
							height: 44,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							flexShrink: 0,
						}}
					>
						✕
					</button>
				</div>
				<div
					style={{
						padding: 16,
						display: 'flex',
						flexDirection: 'column',
						gap: 14,
						overflowY: 'auto',
						WebkitOverflowScrolling: 'touch',
					}}
				>
					<div>
						<div style={{ fontSize: 10, letterSpacing: 2, color: `rgba(${C.dim},0.6)`, marginBottom: 8 }}>
							PALETTE
						</div>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
							{COLOR_SCHEMES.map((s) => (
								<button
									key={s}
									type="button"
									onClick={() => setScheme(s)}
									style={{
										textAlign: 'left',
										cursor: 'pointer',
										padding: '8px 10px',
										border: `1px solid ${scheme === s ? C.cyan : `rgba(${C.cyanGlow},0.25)`}`,
										background: scheme === s ? `rgba(${C.cyanGlow},0.12)` : 'transparent',
										color: scheme === s ? C.cyan : `rgba(${C.dim},0.8)`,
										fontFamily: "'Share Tech Mono', monospace",
										fontSize: 12,
										letterSpacing: 1,
									}}
								>
									{scheme === s ? '◆' : '◇'} {s}
								</button>
							))}
						</div>
					</div>
					<label
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 10,
							fontSize: 12,
							letterSpacing: 1,
							cursor: 'pointer',
						}}
					>
						<input type="checkbox" checked={scanlines} onChange={(e) => setScanlines(e.target.checked)} />
						SCANLINES / CRT SWEEP
					</label>
					<label
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 10,
							fontSize: 12,
							letterSpacing: 1,
							cursor: 'pointer',
						}}
					>
						<input type="checkbox" checked={stagger} onChange={(e) => setStagger(e.target.checked)} />
						STAGGER MESSAGE LAYOUT
					</label>
				</div>
			</div>
		</>
	);
}
