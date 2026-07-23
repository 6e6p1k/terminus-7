import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Apple touch icon — 180×180 PNG required for reliable iOS home-screen install */
export default function AppleIcon() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: '#07070c',
					position: 'relative',
				}}
			>
				<div
					style={{
						width: 136,
						height: 136,
						border: '6px solid #22e6ff',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						position: 'relative',
					}}
				>
					<span
						style={{
							fontSize: 64,
							fontWeight: 700,
							color: '#22e6ff',
							fontFamily: 'monospace',
							letterSpacing: -2,
						}}
					>
						T7
					</span>
					<div
						style={{
							position: 'absolute',
							left: 0,
							bottom: 0,
							width: 56,
							height: 16,
							background: '#ff37c7',
						}}
					/>
				</div>
			</div>
		),
		{ ...size },
	);
}
