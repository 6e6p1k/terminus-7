'use client';

import type { CSSProperties } from 'react';
import { useChat } from '@/lib/chat-context';

export function Sidebar() {
	const {
		colors: C,
		chats,
		activeChatId,
		selectChat,
		newChat,
		collapsed,
		setCollapsed,
		isMobile,
		sidebarOpen,
		setSidebarOpen,
		setSettingsOpen,
	} = useChat();

	const railed = !isMobile && collapsed;

	const sidebarStyle: CSSProperties = isMobile
		? {
				position: 'absolute',
				top: 0,
				left: 0,
				bottom: 0,
				width: '100%',
				maxWidth: 420,
				zIndex: 80,
				background: C.panel,
				backdropFilter: 'blur(2px)',
				borderRight: `2px solid ${C.cyan}`,
				display: 'flex',
				flexDirection: 'column',
				transform: sidebarOpen ? 'translateX(0)' : 'translateX(-102%)',
				transition: 'transform .18s steps(4)',
				boxShadow: sidebarOpen ? '12px 0 40px rgba(0,0,0,0.7)' : 'none',
			}
		: {
				position: 'relative',
				width: collapsed ? 64 : 300,
				flexShrink: 0,
				background: C.panel,
				display: 'flex',
				flexDirection: 'column',
				borderRight: `2px solid ${C.cyan}`,
				overflow: 'hidden',
				clipPath: 'polygon(0 0, 100% 0, 100% 96%, 92% 100%, 0 100%)',
				zIndex: 10,
				transition: 'width .3s steps(9)',
			};

	return (
		<>
			{isMobile && sidebarOpen && (
				<div
					onClick={() => setSidebarOpen(false)}
					style={{
						position: 'absolute',
						inset: 0,
						zIndex: 70,
						background: `rgba(${C.magGlow},0.06)`,
					}}
				/>
			)}
			<aside style={sidebarStyle}>
				<div
					style={{
						display: railed ? 'none' : 'flex',
						flexDirection: 'column',
						flex: 1,
						minWidth: 0,
						width: '100%',
						height: '100%',
					}}
				>
					<div
						style={{
							padding: '18px 16px 14px',
							borderBottom: `1px solid rgba(${C.cyanGlow},0.28)`,
						}}
					>
						<div
							style={{
								fontFamily: 'var(--font-vt323), monospace',
								fontSize: 30,
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
								fontSize: 10,
								letterSpacing: 3,
								color: `rgba(${C.dim},0.5)`,
								marginTop: 6,
							}}
						>
							NEURAL // UPLINK v8.31
						</div>
					</div>

					{!isMobile && (
						<button
							type="button"
							onClick={() => setCollapsed(true)}
							style={{
								width: '100%',
								cursor: 'pointer',
								textAlign: 'left',
								background: 'transparent',
								color: `rgba(${C.dim},0.55)`,
								border: 'none',
								borderBottom: `1px dashed rgba(${C.cyanGlow},0.22)`,
								fontFamily: "'Share Tech Mono', monospace",
								fontSize: 11,
								letterSpacing: 2,
								padding: '9px 16px',
							}}
						>
							«« FOLD_PANEL
						</button>
					)}

					<div style={{ padding: '14px 14px 8px' }}>
						<button
							type="button"
							onClick={newChat}
							className="tm-new-btn"
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
								transition: 'all .08s steps(2)',
							}}
						>
							＋ NEW_CHAT.EXE
						</button>
					</div>

					<div
						style={{
							padding: '6px 14px 4px',
							fontSize: 10,
							letterSpacing: 3,
							color: `rgba(${C.magGlow},0.7)`,
						}}
					>
						◤ SESSION_LOG
					</div>
					<div style={{ flex: 1, overflowY: 'auto', padding: '4px 10px 10px' }}>
						{chats.map((c) => {
							const active = c.id === activeChatId;
							return (
								<div
									key={c.id}
									role="button"
									tabIndex={0}
									onClick={() => void selectChat(c.id)}
									onKeyDown={(e) => e.key === 'Enter' && void selectChat(c.id)}
									className="tm-session"
									style={{
										cursor: 'pointer',
										padding: '9px 10px',
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
												letterSpacing: 0.5,
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
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
											paddingLeft: 16,
										}}
									>
										{c.preview ?? 'session ready'}
									</div>
								</div>
							);
						})}
						{chats.length === 0 && (
							<div style={{ padding: 12, fontSize: 11, opacity: 0.4, letterSpacing: 1 }}>
								NO SESSIONS // initialize NEW_CHAT.EXE
							</div>
						)}
					</div>

					<div
						style={{
							borderTop: `1px solid rgba(${C.cyanGlow},0.28)`,
							padding: '14px 16px',
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
							<div
								style={{
									fontSize: 14,
									color: C.text,
									letterSpacing: 0.5,
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
								}}
							>
								OPERATOR_K
							</div>
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
							onClick={() => setSettingsOpen(true)}
							style={{
								fontFamily: 'var(--font-vt323), monospace',
								fontSize: 20,
								color: `rgba(${C.dim},0.5)`,
								cursor: 'pointer',
								background: 'none',
								border: 'none',
							}}
							aria-label="Settings"
						>
							⚙
						</button>
					</div>
				</div>

				{/* collapsed rail */}
				<div
					style={{
						display: railed ? 'flex' : 'none',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 16,
						padding: '18px 0',
						width: '100%',
						height: '100%',
						animation: 'tm-boot .3s steps(5)',
					}}
				>
					<button
						type="button"
						title="UNFOLD PANEL"
						onClick={() => setCollapsed(false)}
						style={{
							cursor: 'pointer',
							width: 42,
							height: 42,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							background: C.panel,
							border: `1px solid ${C.cyan}`,
							color: C.cyan,
							fontFamily: 'var(--font-vt323), monospace',
							fontSize: 22,
							boxShadow: `2px 2px 0 rgba(${C.cyanGlow},0.35)`,
						}}
					>
						▸
					</button>
					<button
						type="button"
						title="NEW CHAT"
						onClick={newChat}
						style={{
							cursor: 'pointer',
							width: 42,
							height: 42,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							background: C.panel,
							border: `1px solid ${C.mag}`,
							color: C.mag,
							fontFamily: 'var(--font-vt323), monospace',
							fontSize: 22,
							boxShadow: `2px 2px 0 rgba(${C.magGlow},0.4)`,
						}}
					>
						＋
					</button>
					<div style={{ flex: 1 }} />
					<div
						title="OPERATOR_K"
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
				</div>
			</aside>
		</>
	);
}
