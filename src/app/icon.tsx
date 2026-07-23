import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

/** App icon — 512×512 PNG for manifest / install prompts */
export default function Icon() {
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
						width: 384,
						height: 384,
						border: '16px solid #22e6ff',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						position: 'relative',
					}}
				>
					<span
						style={{
							fontSize: 180,
							fontWeight: 700,
							color: '#22e6ff',
							fontFamily: 'monospace',
							letterSpacing: -4,
						}}
					>
						T7
					</span>
					<div
						style={{
							position: 'absolute',
							left: 0,
							bottom: 0,
							width: 160,
							height: 48,
							background: '#ff37c7',
						}}
					/>
				</div>
			</div>
		),
		{ ...size },
	);
}
