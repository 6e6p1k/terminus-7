'use client';

import { useEffect } from 'react';
import { ChatProvider, useChat } from '@/lib/chat-context';
import { DesktopApp } from './DesktopApp';
import { MobileApp } from './MobileApp';

function Shell() {
	const { isMobile, colors } = useChat();

	// Keep document chrome in sync with the active scheme (iOS safe-area / theme-color).
	useEffect(() => {
		const root = document.documentElement;
		const body = document.body;
		root.style.backgroundColor = colors.bg;
		body.style.backgroundColor = colors.bg;
		body.style.color = colors.text;

		let meta = document.querySelector('meta[name="theme-color"]');
		if (!meta) {
			meta = document.createElement('meta');
			meta.setAttribute('name', 'theme-color');
			document.head.appendChild(meta);
		}
		meta.setAttribute('content', colors.bg);
	}, [colors]);

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
