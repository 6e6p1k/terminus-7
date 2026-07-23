<script lang="ts">
	import { store, SCHEME_MAP } from '$lib/stores/chat.svelte';
	import { COLOR_SCHEMES } from '$lib/types';
</script>

{#if store.settingsOpen}
	<!-- Backdrop -->
	<button
		onclick={() => (store.settingsOpen = false)}
		aria-label="Close settings"
		class="fixed inset-0 z-45"
	></button>

	<div
		class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-[420px] animate-tm-boot"
		style="background: #0b0b14; border: 2px solid {store.colors.cyan};
			box-shadow: 0 0 0 2px #07070c, 12px 12px 0 rgba({store.colors.magGlow},0.5), 0 0 30px rgba({store.colors.cyanGlow},0.35);
			clip-path: polygon(0 0,100% 0,100% 94%,95% 100%,0 100%);"
	>
		<!-- Header -->
		<div
			class="flex items-center justify-between px-4 py-3 text-lg tracking-[2px]"
			style="font-family: 'VT323', monospace; color: #07070c; background: {store.colors.cyan};"
		>
			◤ SYSTEM_CONFIG
			<button
				onclick={() => (store.settingsOpen = false)}
				class="cursor-pointer bg-transparent border-0 text-xl"
				style="font-family: 'VT323', monospace; color: #07070c;"
			>
				✕
			</button>
		</div>

		<div class="p-4 flex flex-col gap-5">
			<!-- Color Scheme -->
			<div>
				<div
					class="text-xs tracking-[3px] mb-2.5"
					style="font-family: 'Share Tech Mono', monospace; color: rgba({store.colors.magGlow},0.7);"
				>
					◤ PALETTE
				</div>
				<div class="grid grid-cols-2 gap-2">
					{#each COLOR_SCHEMES as scheme (scheme)}
						{@const sc = SCHEME_MAP[scheme]}
						{@const active = store.scheme === scheme}
						<button
							onclick={() => (store.scheme = scheme)}
							class="cursor-pointer text-left py-2 px-3 text-xs tracking-[0.5px] border transition-colors duration-75"
							style="font-family: 'Share Tech Mono', monospace;
								background: {active ? `rgba(${sc.cyanGlow},0.12)` : 'transparent'};
								border-color: {active ? sc.cyan : `rgba(${sc.cyanGlow},0.2)`};
								color: {active ? sc.cyan : `rgba(${sc.text},0.6)`};"
							onmouseenter={(e) => { e.currentTarget.style.borderColor = sc.cyan; e.currentTarget.style.color = sc.cyan; }}
							onmouseleave={(e) => { e.currentTarget.style.borderColor = active ? sc.cyan : `rgba(${sc.cyanGlow},0.2)`; e.currentTarget.style.color = active ? sc.cyan : `rgba(${sc.text},0.6)`; }}
						>
							<div class="flex items-center gap-2">
								<span class="w-3 h-3 flex-shrink-0" style="background: {sc.cyan}; box-shadow: 0 0 6px {sc.cyan};"></span>
								<span class="w-3 h-3 flex-shrink-0" style="background: {sc.mag}; box-shadow: 0 0 6px {sc.mag};"></span>
								<span class="truncate">{scheme}</span>
							</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Toggles -->
			<div class="flex gap-4">
				<button
					onclick={() => (store.scanlines = !store.scanlines)}
					class="flex-1 cursor-pointer text-center py-2 px-3 text-xs tracking-[1px] border transition-colors duration-75"
					style="font-family: 'Share Tech Mono', monospace;
						background: {store.scanlines ? `rgba(${store.colors.cyanGlow},0.12)` : 'transparent'};
						border-color: {store.scanlines ? store.colors.cyan : `rgba(${store.colors.cyanGlow},0.25)`};
						color: {store.scanlines ? store.colors.cyan : 'rgba(185,247,255,0.45)'};"
				>
					{store.scanlines ? '◆' : '◇'} SCANLINES
				</button>
				<button
					onclick={() => (store.stagger = !store.stagger)}
					class="flex-1 cursor-pointer text-center py-2 px-3 text-xs tracking-[1px] border transition-colors duration-75"
					style="font-family: 'Share Tech Mono', monospace;
						background: {store.stagger ? `rgba(${store.colors.magGlow},0.12)` : 'transparent'};
						border-color: {store.stagger ? store.colors.mag : `rgba(${store.colors.magGlow},0.25)`};
						color: {store.stagger ? store.colors.mag : 'rgba(185,247,255,0.45)'};"
				>
					{store.stagger ? '◆' : '◇'} STAGGER
				</button>
			</div>

			<!-- API Key hint -->
			<div
				class="text-[10px] tracking-[1px] p-3 border border-dashed"
				style="color: rgba(185,247,255,0.5); border-color: rgba({store.colors.cyanGlow},0.25); font-family: 'Share Tech Mono', monospace;"
			>
				AI_GATEWAY_API_KEY is configured via environment variables on the server. Set it in your Vercel project settings.
			</div>
		</div>
	</div>
{/if}
