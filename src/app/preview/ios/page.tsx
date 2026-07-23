'use client';

import { ChatProvider } from '@/lib/chat-context';
import { MobileApp } from '@/components/terminus/MobileApp';
import { IOSDevice } from '@/components/ios/IOSDevice';
import { cssVars } from '@/lib/schemes';
import { SCHEME_MAP } from '@/lib/schemes';
import Link from 'next/link';

function PreviewInner() {
	const C = SCHEME_MAP['CYAN / MAGENTA'];
	return (
		<div
			style={{
				...cssVars(C),
				minHeight: '100dvh',
				width: '100%',
				background: `radial-gradient(120% 90% at 50% 0%, rgba(${C.cyanGlow},0.10), rgba(0,0,0,0) 55%), #060609`,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 20,
				padding: '32px 16px',
				fontFamily: "'Share Tech Mono', monospace",
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 10,
					fontSize: 11,
					letterSpacing: 3,
					color: `rgba(${C.dim},0.55)`,
				}}
			>
				<span
					className="tm-pulse"
					style={{
						display: 'inline-block',
						width: 8,
						height: 8,
						background: C.cyan,
						boxShadow: `0 0 8px ${C.cyan}`,
					}}
				/>
				TERMINUS·7 <span style={{ color: `rgba(${C.dim},0.3)` }}>▚</span> iOS PROGRESSIVE WEB APP{' '}
				<span style={{ color: `rgba(${C.dim},0.3)` }}>▚</span> STANDALONE
			</div>
			<IOSDevice dark>
				<MobileApp framed />
			</IOSDevice>
			<Link href="/" style={{ color: C.cyan, fontSize: 12, letterSpacing: 2, textDecoration: 'none' }}>
				← BACK TO MAIN UPLINK
			</Link>
		</div>
	);
}

export default function IosPreviewPage() {
	return (
		<ChatProvider>
			<PreviewInner />
		</ChatProvider>
	);
}
