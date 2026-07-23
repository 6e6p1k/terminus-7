'use client';

import { useChat } from '@/lib/chat-context';
import { Atmosphere } from './Atmosphere';
import { Sidebar } from './Sidebar';
import { CommandInput } from './CommandInput';
import { ChatFeed } from './ChatFeed';
import { SettingsPanel } from './SettingsPanel';
import { cssVars } from '@/lib/schemes';

export function DesktopApp() {
	const { colors, isMobile, setSidebarOpen } = useChat();

	return (
		<div
			style={{
				...cssVars(colors),
				position: 'relative',
				height: '100dvh',
				width: '100%',
				overflow: 'hidden',
				fontFamily: "'Share Tech Mono', monospace",
				display: 'flex',
			}}
		>
			<Atmosphere />
			<Sidebar />
			<main
				style={{
					flex: 1,
					minWidth: 0,
					position: 'relative',
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden',
				}}
			>
				{isMobile && (
					<button
						type="button"
						onClick={() => setSidebarOpen(true)}
						style={{
							position: 'absolute',
							top: 12,
							left: 12,
							zIndex: 60,
							cursor: 'pointer',
							width: 44,
							height: 44,
							background: colors.cyan,
							color: colors.bg,
							border: 'none',
							fontSize: 26,
							lineHeight: '44px',
							fontFamily: 'var(--font-vt323), monospace',
							boxShadow: `4px 4px 0 ${colors.mag}`,
						}}
					>
						≣
					</button>
				)}
				<CommandInput />
				<ChatFeed />
			</main>
			<SettingsPanel />
		</div>
	);
}
