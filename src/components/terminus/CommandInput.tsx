'use client';

import type { CSSProperties } from 'react';
import { MODEL_NAMES, MODEL_CATALOG } from '@/lib/types';
import { useChat } from '@/lib/chat-context';

export function CommandInput() {
	const {
		colors: C,
		input,
		setInput,
		send,
		stop,
		attach,
		generating,
		clock,
		temp,
		currentModel,
		setCurrentModel,
		modelOpen,
		setModelOpen,
		isMobile,
		attachHint,
	} = useChat();

	const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			void send();
		}
	};

	const modelChipStyle: CSSProperties = {
		cursor: 'pointer',
		background: 'transparent',
		color: modelOpen ? C.cyan : `rgba(${C.dim},0.6)`,
		border: `1px dashed rgba(${C.cyanGlow},${modelOpen ? '0.7' : '0.35'})`,
		fontFamily: "'Share Tech Mono', monospace",
		fontSize: 10,
		letterSpacing: 1,
		padding: '3px 8px',
		whiteSpace: 'nowrap',
	};

	return (
		<div
			style={{
				flexShrink: 0,
				padding: isMobile ? '64px 12px 8px' : '20px 24px 10px',
				position: 'relative',
				zIndex: 20,
			}}
		>
			<div
				style={{
					position: 'relative',
					background: C.panel,
					border: `2px solid ${C.cyan}`,
					boxShadow: `0 0 0 2px ${C.bg}, 8px 8px 0 rgba(${C.magGlow},0.55), 0 0 26px rgba(${C.cyanGlow},0.35)`,
					clipPath: 'polygon(0 0,100% 0,100% 78%,97% 100%,3% 100%,0 82%)',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '6px 12px',
						background: `linear-gradient(90deg,${C.cyan},${C.panel})`,
						borderBottom: `1px solid rgba(${C.cyanGlow},0.35)`,
					}}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							fontFamily: 'var(--font-vt323), monospace',
							fontSize: 16,
							color: C.bg,
							letterSpacing: 2,
							fontWeight: 'bold',
						}}
					>
						<span
							className="tm-blink"
							style={{
								display: 'inline-block',
								width: 8,
								height: 8,
								background: '#ff2b2b',
								boxShadow: '0 0 8px #ff2b2b',
							}}
						/>
						CMD_INPUT :: LIVE
					</div>
					<div
						style={{
							fontFamily: 'var(--font-vt323), monospace',
							fontSize: 15,
							color: 'rgba(7,7,12,0.7)',
							letterSpacing: 1,
						}}
					>
						{clock}
					</div>
				</div>

				<div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, padding: 12 }}>
					<div style={{ flex: 1, position: 'relative' }}>
						<div
							style={{
								position: 'absolute',
								left: 10,
								top: 11,
								fontFamily: 'var(--font-vt323), monospace',
								fontSize: 20,
								color: C.mag,
								pointerEvents: 'none',
							}}
						>
							&gt;_
						</div>
						<textarea
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={onKey}
							placeholder="TRANSMIT DIRECTIVE TO NEURAL CORE..."
							rows={2}
							style={{
								width: '100%',
								resize: 'none',
								background: C.bg,
								color: C.text,
								border: `1px solid rgba(${C.cyanGlow},0.4)`,
								outline: 'none',
								padding: '10px 12px 10px 34px',
								fontSize: 14,
								lineHeight: 1.5,
								letterSpacing: 0.5,
								fontFamily: "'Share Tech Mono', monospace",
							}}
						/>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
						<button
							type="button"
							onClick={() => void send()}
							disabled={generating}
							style={{
								cursor: 'pointer',
								fontFamily: 'var(--font-vt323), monospace',
								fontSize: 24,
								letterSpacing: 2,
								color: C.bg,
								background: C.cyan,
								border: 'none',
								padding: '10px 18px',
								boxShadow: `4px 4px 0 ${C.mag}`,
								transition: 'all .08s steps(2)',
								opacity: generating ? 0.6 : 1,
							}}
						>
							SEND ▶
						</button>
						<div style={{ display: 'flex', gap: 6 }}>
							<button
								type="button"
								onClick={attach}
								style={{
									flex: 1,
									cursor: 'pointer',
									background: C.panel,
									color: C.cyan,
									border: `1px solid ${C.cyan}`,
									fontFamily: "'Share Tech Mono', monospace",
									fontSize: 11,
									padding: '6px 8px',
									letterSpacing: 1,
								}}
							>
								⚟ ATT
							</button>
							<button
								type="button"
								onClick={stop}
								style={{
									flex: 1,
									cursor: 'pointer',
									background: C.panel,
									color: generating ? C.mag : `rgba(${C.dim},0.4)`,
									border: `1px solid ${generating ? C.mag : `rgba(${C.dim},0.3)`}`,
									fontFamily: "'Share Tech Mono', monospace",
									fontSize: 11,
									padding: '6px 8px',
									letterSpacing: 1,
									animation: generating ? 'tm-pulse 1s steps(2) infinite' : 'none',
								}}
							>
								◼ STOP
							</button>
						</div>
					</div>
				</div>

				<div
					style={{
						padding: '4px 10px 8px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 10,
						borderTop: `1px dashed rgba(${C.cyanGlow},0.2)`,
					}}
				>
					<button type="button" onClick={() => setModelOpen(!modelOpen)} style={modelChipStyle}>
						◆ {currentModel} ▾
					</button>
					<span
						style={{
							fontSize: 9,
							letterSpacing: 2,
							color: `rgba(${C.dim},0.35)`,
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{attachHint || `ENC:AES-256 ▚ LAT:11ms ▚ CORE_TEMP:${temp}°`}
					</span>
				</div>
			</div>

			{modelOpen && (
				<>
					<div
						onClick={() => setModelOpen(false)}
						style={{ position: 'fixed', inset: 0, zIndex: 35 }}
					/>
					<div
						style={{
							position: 'absolute',
							top: 'calc(100% - 14px)',
							left: isMobile ? 12 : 24,
							minWidth: 286,
							zIndex: 40,
							background: C.panel,
							border: `2px solid ${C.cyan}`,
							boxShadow: `0 0 0 2px ${C.bg}, 8px 8px 0 rgba(${C.magGlow},0.5), 0 0 24px rgba(${C.cyanGlow},0.35)`,
							clipPath: 'polygon(0 0,100% 0,100% 92%,96% 100%,0 100%)',
							animation: 'tm-boot .16s steps(3)',
						}}
					>
						<div
							style={{
								padding: '8px 12px',
								fontFamily: 'var(--font-vt323), monospace',
								fontSize: 16,
								letterSpacing: 2,
								color: C.bg,
								background: C.cyan,
								borderBottom: `1px solid ${C.bg}`,
							}}
						>
							◤ SELECT NEURAL MODEL
						</div>
						{MODEL_NAMES.map((name) => {
							const active = name === currentModel;
							return (
								<button
									key={name}
									type="button"
									onClick={() => {
										setCurrentModel(name);
										setModelOpen(false);
									}}
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 10,
										width: '100%',
										textAlign: 'left',
										cursor: 'pointer',
										padding: '9px 12px',
										border: 'none',
										borderBottom: `1px solid rgba(${C.cyanGlow},0.14)`,
										background: active ? `rgba(${C.cyanGlow},0.12)` : 'transparent',
										color: active ? C.cyan : `rgba(${C.dim},0.75)`,
										fontFamily: "'Share Tech Mono', monospace",
										fontSize: 12,
										letterSpacing: 0.5,
									}}
								>
									<span style={{ width: 14, flexShrink: 0 }}>{active ? '◆' : '◇'}</span>
									<span style={{ flex: 1, fontSize: 13, letterSpacing: 1 }}>{name}</span>
									<span style={{ fontSize: 9, opacity: 0.6, letterSpacing: 1, whiteSpace: 'nowrap' }}>
										{MODEL_CATALOG[name].tag}
									</span>
								</button>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
}
