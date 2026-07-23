import type { Metadata, Viewport } from 'next';
import { Share_Tech_Mono, VT323 } from 'next/font/google';
import './globals.css';

const shareTech = Share_Tech_Mono({
	weight: '400',
	subsets: ['latin'],
	variable: '--font-share-tech',
	display: 'swap',
});

const vt323 = VT323({
	weight: '400',
	subsets: ['latin'],
	variable: '--font-vt323',
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'TERMINUS·7',
	description: 'Neural-core uplink terminal — cyberpunk LLM chat',
	applicationName: 'TERMINUS·7',
	appleWebApp: {
		capable: true,
		statusBarStyle: 'black-translucent',
		title: 'TERMINUS·7',
	},
	manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
	themeColor: '#07070c',
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	viewportFit: 'cover',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${shareTech.variable} ${vt323.variable} h-full`}>
			<body className={`${shareTech.className} min-h-full`}>{children}</body>
		</html>
	);
}
