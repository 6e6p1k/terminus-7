'use client';

import type { CSSProperties } from 'react';
import { MODEL_NAMES, MODEL_CATALOG } from '@/lib/types';
import { useChat } from '@/lib/chat-context';
import { Atmosphere } from './Atmosphere';
import { ChatFeed } from './ChatFeed';
import { SettingsPanel } from './SettingsPanel';
import { cssVars } from '@/lib/schemes';

/** Mobile / PWA layout from Terminus-7_iOS_PWA design */
export function MobileApp({ framed = false }: { framed?: boolean }) {
	const {
		colors: C,
		activeChat,
		activeChatId,
		sidebarOpen,
		setSidebarOpen,
		newChat,
		chats,
		selectChat,
		clock,
		temp,
		currentModel,
		setCurrentModel,
		modelOpen,
		setModelOpen,
		input,
		setInput,
		send,
		stop,
		attach,
		generating,
		setSettingsOpen,
	} = useChat();

	const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			void send();
		}
	};

	// Framed preview fakes device chrome; real iOS PWA needs env(safe-area-inset-*).
	const topInset = framed ? 52 : 'env(safe-area-inset-top, 0px)';
	const bottomInset = framed ? 26 : 'max(12px, env(safe-area-inset-bottom, 0px))';
	const leftInset = framed ? 0 : 'env(safe-area-inset-left, 0px)';
	const rightInset = framed ? 0 : 'env(safe-area-inset-right, 0px)';

	const shellStyle: CSSProperties = {
		...cssVars(C),
		position: 'relative',
		height: framed ? '100%' : '100dvh',
		width: '100%',
		overflow: 'hidden',
		fontFamily: "'Share Tech Mono', monospace",
		display: 'flex',
		flexDirection: 'column',
		paddingTop: topInset,
		paddingLeft: leftInset,
		paddingRight: rightInset,
	};

	return (
		<div style={shellStyle}>
			<Atmosphere scoped={framed} />

			{/* app bar */}
			<div
				style={{
					flexShrink: 0,
					display: 'flex',
					alignItems: 'center',
					gap: 10,
					padding: '8px 12px',
					background: `linear-gradient(180deg,rgba(${C.cyanGlow},0.08),transparent)`,
					borderBottom: `1px solid rgba(${C.cyanGlow},0.3)`,
					position: 'relative',
					zIndex: 6,
				}}
			>
				<button
					type="button"
					title="SESSIONS"
					onClick={() => setSidebarOpen(true)}
					style={{
						cursor: 'pointer',
						width: 44,
						height: 44,
						flexShrink: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						background: C.panel,
						border: `1px solid ${C.cyan}`,
						color: C.cyan,
						fontFamily: 'var(--font-vt323), monospace',
						fontSize: 26,
						boxShadow: `3px 3px 0 rgba(${C.magGlow},0.4)`,
					}}
				>
					≣
				</button>
				<div style={{ flex: 1, minWidth: 0, textAlign: 'center', lineHeight: 1 }}>
					<div
						style={{
							fontFamily: 'var(--font-vt323), monospace',
							fontSize: 26,
							color: C.cyan,
							letterSpacing: 1,
							textShadow: `0 0 10px rgba(${C.cyanGlow},0.55)`,
						}}
					>
						TERMINUS<span style={{ color: C.mag }}>·7</span>
					</div>
					<div
						style={{
							fontSize: 9,
							letterSpacing: 2,
							color: `rgba(${C.dim},0.45)`,
							marginTop: 2,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						}}
					>
						{activeChat?.title ?? 'NEW SESSION'}
					</div>
				</div>
				<button
					type="button"
					title="NEW CHAT"
					onClick={newChat}
					style={{
						cursor: 'pointer',
						width: 44,
						height: 44,
						flexShrink: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						background: C.cyan,
						border: 'none',
						color: C.bg,
						fontFamily: 'var(--font-vt323), monospace',
						fontSize: 28,
						boxShadow: `3px 3px 0 ${C.mag}`,
						clipPath: 'polygon(0 0,100% 0,100% 74%,88% 100%,0 100%)',
					}}
				>
					＋
				</button>
			</div>

			{/* telemetry */}
			<div
				style={{
					flexShrink: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '5px 14px',
					borderBottom: `1px dashed rgba(${C.cyanGlow},0.2)`,
					background: C.panel,
					fontSize: 9,
					letterSpacing: 1.5,
					color: `rgba(${C.dim},0.45)`,
				}}
			>
				<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
					<span
						className="tm-blink"
						style={{
							display: 'inline-block',
							width: 6,
							height: 6,
							background: '#ff2b2b',
							boxShadow: '0 0 6px #ff2b2b',
						}}
					/>
					LIVE
				</span>
				<span>
					CORE {temp}° ▚ LAT 11ms ▚ AES-256
				</span>
				<span style={{ fontFamily: 'var(--font-vt323), monospace', fontSize: 14, color: C.cyan }}>{clock}</span>
			</div>

			<ChatFeed compact />

			{/* input dock */}
			<div
				style={{
					flexShrink: 0,
					background: C.panel,
					borderTop: `2px solid ${C.cyan}`,
					boxShadow: '0 -6px 20px rgba(0,0,0,0.5)',
					paddingTop: 8,
					paddingLeft: 12,
					paddingRight: 12,
					paddingBottom: bottomInset,
					position: 'relative',
					zIndex: 6,
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 8,
						marginBottom: 7,
					}}
				>
					<button
						type="button"
						onClick={() => setModelOpen(!modelOpen)}
						style={{
							cursor: 'pointer',
							background: 'transparent',
							color: modelOpen ? C.cyan : `rgba(${C.dim},0.65)`,
							border: `1px dashed rgba(${C.cyanGlow},${modelOpen ? '0.7' : '0.4'})`,
							fontFamily: "'Share Tech Mono', monospace",
							fontSize: 11,
							letterSpacing: 1,
							padding: '12px 12px',
							minHeight: 44,
							boxSizing: 'border-box',
							whiteSpace: 'nowrap',
							flex: '0 1 auto',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						◆ {currentModel} ▾
					</button>
					<button
						type="button"
						onClick={attach}
						style={{
							cursor: 'pointer',
							flexShrink: 0,
							background: C.bg,
							color: C.cyan,
							border: `1px solid rgba(${C.cyanGlow},0.5)`,
							fontFamily: "'Share Tech Mono', monospace",
							fontSize: 11,
							padding: '12px 12px',
							minHeight: 44,
							boxSizing: 'border-box',
							letterSpacing: 1,
						}}
					>
						⚟ ATT
					</button>
				</div>
				<div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
					<div style={{ flex: 1, position: 'relative' }}>
						<div
							style={{
								position: 'absolute',
								left: 9,
								top: 10,
								fontFamily: 'var(--font-vt323), monospace',
								fontSize: 18,
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
							placeholder="TRANSMIT DIRECTIVE..."
							rows={1}
							style={{
								width: '100%',
								resize: 'none',
								background: C.bg,
								color: C.text,
								border: `1px solid rgba(${C.cyanGlow},0.4)`,
								outline: 'none',
								padding: '9px 10px 9px 32px',
								fontSize: 14,
								lineHeight: 1.4,
								letterSpacing: 0.5,
								fontFamily: "'Share Tech Mono', monospace",
							}}
						/>
					</div>
					<button
						type="button"
						onClick={() => void send()}
						disabled={generating}
						style={{
							cursor: 'pointer',
							flexShrink: 0,
							fontFamily: 'var(--font-vt323), monospace',
							fontSize: 22,
							letterSpacing: 1,
							color: C.bg,
							background: C.cyan,
							border: 'none',
							padding: '9px 14px',
							boxShadow: `4px 4px 0 ${C.mag}`,
							opacity: generating ? 0.6 : 1,
						}}
					>
						▶
					</button>
				</div>
				{generating && (
					<button
						type="button"
						onClick={stop}
						className="tm-pulse"
						style={{
							width: '100%',
							marginTop: 7,
							cursor: 'pointer',
							background: C.bg,
							color: C.mag,
							border: `1px solid ${C.mag}`,
							fontFamily: "'Share Tech Mono', monospace",
							fontSize: 11,
							padding: 6,
							letterSpacing: 2,
						}}
					>
						◼ STOP GENERATION
					</button>
				)}
			</div>

			{/* model sheet */}
			{modelOpen && (
				<>
					<div
						onClick={() => setModelOpen(false)}
						style={{
							position: 'absolute',
							inset: 0,
							zIndex: 30,
							background: 'rgba(0,0,0,0.55)',
						}}
					/>
					<div
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							bottom: 0,
							zIndex: 31,
							paddingBottom: bottomInset,
							paddingLeft: leftInset,
							paddingRight: rightInset,
							background: C.panel,
							borderTop: `2px solid ${C.cyan}`,
							boxShadow: `0 0 0 2px ${C.bg}, 0 -10px 30px rgba(${C.cyanGlow},0.3)`,
							animation: 'tm-sheet .18s steps(4)',
						}}
					>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
							<div style={{ width: 40, height: 4, background: `rgba(${C.cyanGlow},0.5)` }} />
						</div>
						<div
							style={{
								padding: '6px 14px 10px',
								fontFamily: 'var(--font-vt323), monospace',
								fontSize: 18,
								letterSpacing: 2,
								color: C.bg,
								background: C.cyan,
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
										padding: '12px 16px',
										border: 'none',
										borderBottom: `1px solid rgba(${C.cyanGlow},0.14)`,
										background: active ? `rgba(${C.cyanGlow},0.12)` : 'transparent',
										color: active ? C.cyan : `rgba(${C.dim},0.78)`,
										fontFamily: "'Share Tech Mono', monospace",
										fontSize: 13,
										letterSpacing: 0.5,
									}}
								>
									<span style={{ width: 16, flexShrink: 0 }}>{active ? '◆' : '◇'}</span>
									<span style={{ flex: 1 }}>{name}</span>
									<span style={{ fontSize: 9, opacity: 0.6 }}>{MODEL_CATALOG[name].tag}</span>
								</button>
							);
						})}
					</div>
				</>
			)}

			{/* sessions slide-over — absolute overlays ignore shell padding; inset explicitly */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 50,
					paddingTop: topInset,
					paddingLeft: leftInset,
					paddingRight: rightInset,
					background: C.panel,
					display: 'flex',
					flexDirection: 'column',
					borderRight: `2px solid ${C.cyan}`,
					transform: sidebarOpen ? 'translateX(0)' : 'translateX(-102%)',
					transition: 'transform .2s steps(4)',
					boxShadow: sidebarOpen ? '14px 0 40px rgba(0,0,0,0.7)' : 'none',
				}}
			>
				<div
					style={{
						flexShrink: 0,
						display: 'flex',
						alignItems: 'flex-start',
						justifyContent: 'space-between',
						padding: '12px 16px',
						borderBottom: `1px solid rgba(${C.cyanGlow},0.3)`,
					}}
				>
					<div>
						<div
							style={{
								fontFamily: 'var(--font-vt323), monospace',
								fontSize: 32,
								lineHeight: 0.9,
								color: C.cyan,
								letterSpacing: 1,
								textShadow: `0 0 10px rgba(${C.cyanGlow},0.55)`,
							}}
						>
							TERMINUS<span style={{ color: C.mag }}>·7</span>
						</div>
						<div
							style={{
								fontSize: 9,
								letterSpacing: 3,
								color: `rgba(${C.dim},0.5)`,
								marginTop: 6,
							}}
						>
							NEURAL // UPLINK v8.31
						</div>
					</div>
					<button
						type="button"
						onClick={() => setSidebarOpen(false)}
						style={{
							cursor: 'pointer',
							width: 44,
							height: 44,
							flexShrink: 0,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							background: C.panel,
							border: `1px solid ${C.mag}`,
							color: C.mag,
							fontFamily: 'var(--font-vt323), monospace',
							fontSize: 24,
							boxShadow: `3px 3px 0 rgba(${C.magGlow},0.35)`,
						}}
					>
						✕
					</button>
				</div>

				<div style={{ padding: '14px 14px 8px', flexShrink: 0 }}>
					<button
						type="button"
						onClick={newChat}
						style={{
							width: '100%',
							cursor: 'pointer',
							fontFamily: 'var(--font-vt323), monospace',
							fontSize: 22,
							letterSpacing: 1,
							color: C.bg,
							background: C.cyan,
							border: 'none',
							padding: '12px 14px',
							textAlign: 'left',
							boxShadow: `5px 5px 0 ${C.mag}`,
							clipPath: 'polygon(0 0,100% 0,100% 72%,94% 100%,0 100%)',
						}}
					>
						＋ NEW_CHAT.EXE
					</button>
				</div>

				<div
					style={{
						padding: '6px 16px 4px',
						fontSize: 10,
						letterSpacing: 3,
						color: `rgba(${C.magGlow},0.7)`,
						flexShrink: 0,
					}}
				>
					◤ SESSION_LOG
				</div>
				<div style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 10px' }}>
					{chats.map((c) => {
						const active = c.id === activeChatId;
						return (
							<div
								key={c.id}
								role="button"
								tabIndex={0}
								onClick={() => void selectChat(c.id)}
								onKeyDown={(e) => e.key === 'Enter' && void selectChat(c.id)}
								style={{
									cursor: 'pointer',
									padding: '10px 10px',
									marginBottom: 6,
									background: active ? `rgba(${C.cyanGlow},0.12)` : 'transparent',
									border: `1px solid ${active ? C.cyan : `rgba(${C.cyanGlow},0.18)`}`,
									color: active ? C.cyan : `rgba(${C.dim},0.85)`,
									boxShadow: active
										? `0 0 14px rgba(${C.cyanGlow},0.3), inset 0 0 0 1px rgba(${C.cyanGlow},0.4)`
										: 'none',
								}}
							>
								<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
									<span
										style={{
											width: 8,
											height: 8,
											flexShrink: 0,
											background: active ? C.mag : `rgba(${C.cyanGlow},0.5)`,
											boxShadow: active ? `0 0 8px ${C.mag}` : 'none',
										}}
									/>
									<span
										style={{
											flex: 1,
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
											fontSize: 14,
										}}
									>
										{c.title}
									</span>
								</div>
								<div
									style={{
										fontSize: 10,
										color: `rgba(${C.dim},0.4)`,
										marginTop: 4,
										paddingLeft: 16,
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}}
								>
									{c.preview ?? 'session ready'}
								</div>
							</div>
						);
					})}
				</div>

				<div
					style={{
						flexShrink: 0,
						borderTop: `1px solid rgba(${C.cyanGlow},0.28)`,
						paddingTop: 14,
						paddingLeft: 16,
						paddingRight: 16,
						paddingBottom: bottomInset,
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						background: `rgba(${C.cyanGlow},0.03)`,
					}}
				>
					<div
						style={{
							width: 40,
							height: 40,
							flexShrink: 0,
							background: C.panel,
							border: `2px solid ${C.mag}`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontFamily: 'var(--font-vt323), monospace',
							fontSize: 22,
							color: C.mag,
							boxShadow: `0 0 10px rgba(${C.magGlow},0.4)`,
						}}
					>
						◕
					</div>
					<div style={{ flex: 1, minWidth: 0 }}>
						<div style={{ fontSize: 14, color: C.text, letterSpacing: 0.5 }}>OPERATOR_K</div>
						<div style={{ fontSize: 10, color: C.cyan, letterSpacing: 2 }}>
							<span
								className="tm-pulse"
								style={{
									display: 'inline-block',
									width: 7,
									height: 7,
									background: C.cyan,
									marginRight: 5,
								}}
							/>
							ROOT ACCESS
						</div>
					</div>
					<button
						type="button"
						title="SETTINGS"
						onClick={() => setSettingsOpen(true)}
						style={{
							fontFamily: 'var(--font-vt323), monospace',
							fontSize: 20,
							color: `rgba(${C.dim},0.5)`,
							cursor: 'pointer',
							background: 'none',
							border: 'none',
							width: 44,
							height: 44,
							flexShrink: 0,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						⚙
					</button>
				</div>
			</div>

			<SettingsPanel />
		</div>
	);
}
