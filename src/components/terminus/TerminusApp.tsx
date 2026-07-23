'use client';

import { ChatProvider, useChat } from '@/lib/chat-context';
import { DesktopApp } from './DesktopApp';
import { MobileApp } from './MobileApp';

function Shell() {
	const { isMobile } = useChat();
	// On narrow viewports use the PWA/mobile layout; desktop uses sidebar + top CMD input.
	if (isMobile) return <MobileApp />;
	return <DesktopApp />;
}

export function TerminusApp() {
	return (
		<ChatProvider>
			<Shell />
		</ChatProvider>
	);
}
