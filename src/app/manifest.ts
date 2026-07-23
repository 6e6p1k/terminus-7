import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'TERMINUS·7',
		short_name: 'TERMINUS·7',
		description: 'Neural-core uplink terminal',
		start_url: '/',
		display: 'standalone',
		background_color: '#07070c',
		theme_color: '#07070c',
		orientation: 'portrait',
		icons: [
			{
				src: '/icon',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: '/icon',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: '/icon.svg',
				sizes: 'any',
				type: 'image/svg+xml',
				purpose: 'any',
			},
		],
	};
}
